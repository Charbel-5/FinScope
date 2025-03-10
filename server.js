const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./src/db');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'A_SECRET';
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// =============================
//  CRUD for transactions
// =============================

// Get a transaction by ID
app.get('/api/transactions/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM transaction WHERE transaction_id = ?', [transactionId]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving transaction');
  }
});

// Get all transactions for a specific user
app.get('/api/:userId/transactions', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM transaction WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving transactions');
  }
});

// Create or update a transaction
app.post('/api/:userId/transactions', async (req, res) => {
  const transactionObj = req.body;

  try {
    if (transactionObj.transaction_id) {
      // Update existing
      await pool.query(
        `UPDATE transaction
           SET transaction_date = ?,
               transaction_amount = ?,
               transaction_name = ?,
               transaction_category_id = ?,
               transaction_type_id = ?,
               user_id = ?,
               from_account_id = ?,
               to_account_id = ?
         WHERE transaction_id = ?`,
        [
          new Date(transactionObj.transaction_date),
          transactionObj.transaction_amount,
          transactionObj.transaction_name,
          transactionObj.transaction_category_id,
          transactionObj.transaction_type_id,
          transactionObj.user_id,
          transactionObj.from_account_id,
          transactionObj.to_account_id || null,
          transactionObj.transaction_id
        ]
      );
      res.sendStatus(200);
    } else {
      // Insert new
      await pool.query(
        `INSERT INTO transaction (
           transaction_date,
           transaction_amount,
           transaction_name,
           transaction_category_id,
           transaction_type_id,
           user_id,
           from_account_id,
           to_account_id
         ) VALUES (?,?,?,?,?,?,?,?)`,
        [
          new Date(transactionObj.transaction_date),
          transactionObj.transaction_amount,
          transactionObj.transaction_name,
          transactionObj.transaction_category_id,
          transactionObj.transaction_type_id,
          transactionObj.user_id,
          transactionObj.from_account_id,
          transactionObj.to_account_id || null
        ]
      );
      res.sendStatus(201);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving transaction');
  }
});

// Delete a transaction by its ID
app.delete('/api/transactions/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  try {
    await pool.query('DELETE FROM transaction WHERE transaction_id = ?', [transactionId]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting transaction');
  }
});

// =============================
//  CRUD for accounts
// =============================


// Get accounts for a specific user
app.get('/api/accounts/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT 
        a.*, 
        at.account_type_description,
        c.symbol AS currency_symbol,
        c_primary.symbol AS primary_currency_symbol
      FROM account a
      JOIN account_type at ON a.account_type_id = at.account_type_id
      JOIN currency c ON a.currency_id = c.currency_id
      JOIN users u ON a.user_id = u.user_id
      JOIN currency c_primary ON u.primary_currency_id = c_primary.currency_id
      WHERE a.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving accounts');
  }
});


// Create an account
app.post('/api/accounts', async (req, res) => {
  const { name, total_amount, account_type_id, user_id, currency_choice } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[userRow]] = await conn.query(
      'SELECT primary_currency_id, secondary_currency_id FROM users WHERE user_id = ?',
      [user_id]
    );
    if (!userRow) {
      throw new Error(`User not found with ID: ${user_id}`);
    }

    let currency_id;
    if (currency_choice === 'primary') {
      currency_id = userRow.primary_currency_id;
    } else if (currency_choice === 'secondary') {
      currency_id = userRow.secondary_currency_id;
    } else {
      throw new Error('Invalid currency choice');
    }

    await conn.query(
      `INSERT INTO account (
         name, total_amount, account_type_id, user_id, currency_id
       ) VALUES (?,?,?,?,?)`,
      [name, total_amount, account_type_id, user_id, currency_id]
    );

    await conn.commit();
    res.sendStatus(201);
  } catch (err) {
    await conn.rollback();
    console.error('Error creating account:', err.message);
    res.status(500).send(`Error creating account: ${err.message}`);
  } finally {
    conn.release();
  }
});


// Update an account
app.put('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, total_amount, account_type_id, user_id, currency_id } = req.body;
  try {
    await pool.query(
      `UPDATE account
       SET name = ?,
           total_amount = ?,
           account_type_id = ?,
           user_id = ?,
           currency_id = ?
       WHERE account_id = ?`,
      [name, total_amount, account_type_id, user_id, currency_id, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating account');
  }
});

// Delete an account
app.delete('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM account WHERE account_id = ? ', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting account');
  }
});


// =============================
//  CRUD for account_type
// =============================

// Get all account_types
app.get('/api/account_types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM account_type');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting account_types');
  }
});


// Create account_type
app.post('/api/account_types', async (req, res) => {
  const { account_type_description } = req.body;
  try {
    await pool.query('INSERT INTO account_type (account_type_description) VALUES (?)',
      [account_type_description]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating account_type');
  }
});

// Update account_type
app.put('/api/account_types/:id', async (req, res) => {
  const { id } = req.params;
  const { account_type_description } = req.body;
  try {
    await pool.query(
      'UPDATE account_type SET account_type_description = ? WHERE account_type_id = ?',
      [account_type_description, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating account_type');
  }
});

// Delete account_type
app.delete('/api/account_types/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM account_type WHERE account_type_id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting account_type');
  }
});

// =============================
//  CRUD for transaction_type
// =============================

// Get all transaction_types
app.get('/api/transaction_types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transaction_type');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting transaction_types');
  }
});

// =============================
//  CRUD for transaction_category
// =============================

// Get all transaction_categories
app.get('/api/transaction_categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transaction_category');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting transaction_categories');
  }
});

// Get transaction_category by User ID
app.get('/api/transaction_categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM transaction_category WHERE user_id = ?', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting transaction_category');
  }
});

// Create transaction_category
app.post('/api/transaction_categories', async (req, res) => {
  const { transaction_category_de, user_id, transaction_type_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO transaction_category (
        transaction_category_de,
        user_id,
        transaction_type_id
      ) VALUES (?,?,?)`,
      [transaction_category_de, user_id, transaction_type_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating transaction_category');
  }
});

// Update transaction_category
app.put('/api/transaction_categories/:id', async (req, res) => {
  const { id } = req.params;
  const { transaction_category_de, user_id, transaction_type_id } = req.body;
  try {
    await pool.query(
      `UPDATE transaction_category
       SET transaction_category_de = ?,
           user_id = ?,
           transaction_type_id = ?
       WHERE transaction_category_id = ?`,
      [transaction_category_de, user_id, transaction_type_id, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating transaction_category');
  }
});

// Delete transaction_category
app.delete('/api/transaction_categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transaction_category WHERE transaction_category_id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting transaction_category');
  }
});

// =============================
//  CRUD for currency
// =============================

// Get all currencies
app.get('/api/currencies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM currency');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting currencies');
  }
});


// =============================
//  CRUD for currency_rate
// =============================


// Get currency_rate by USer ID
app.get('/api/currency_rates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM currency_rate WHERE user_id = ?', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting currency_rate');
  }
});

// Create currency_rate
app.post('/api/currency_rates', async (req, res) => {
  const { conversion_rate, start_date, user_id } = req.body;
  
  try {
    const formattedDate = new Date(start_date).toISOString().slice(0, 10);
    
    await pool.query(
      'INSERT INTO currency_rate (conversion_rate, start_date, user_id) VALUES (?, ?, ?)',
      [parseFloat(conversion_rate), formattedDate, user_id]
    );
    
    res.sendStatus(201);
  } catch (err) {
    console.error('Error creating currency rate:', err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
//  CRUD for user_stocks
// ============================

// Get user_stock by User ID
app.get('/api/user_stocks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM user_stocks WHERE user_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('User stock not found');
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting user_stock');
  }
});

// Create user_stock
app.post('/api/user_stocks', async (req, res) => {
  const { stock_ticker, stock_amount, user_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO user_stocks (
         stock_ticker,
         stock_amount,
         user_id
       ) VALUES (?,?,?)`,
      [stock_ticker, stock_amount, user_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user_stock');
  }
});

// Update user_stock
app.put('/api/user_stocks/:id', async (req, res) => {
  const { id } = req.params;
  const { stock_ticker, stock_amount, user_id } = req.body;
  try {
    await pool.query(
      `UPDATE user_stocks
       SET stock_ticker = ?,
           stock_amount = ?,
           user_id = ?
       WHERE stock_id = ?`,
      [stock_ticker, stock_amount, user_id, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user_stock');
  }
});

// Delete user_stock
app.delete('/api/user_stocks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM user_stocks WHERE stock_id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user_stock');
  }
});

// =============================
//  CRUD for users
// =============================

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting user');
  }
});

app.post('/api/users', async (req, res) => {
  const { email, password, user_name, primary_currency_id, secondary_currency_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO users (
         email,
         password,
         user_name,
         primary_currency_id,
         secondary_currency_id
       ) VALUES (?,?,?,?,?)`,
      [email, password, user_name, primary_currency_id, secondary_currency_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, user_name, password } = req.body;
  
  try {
    // Build dynamic SQL query based on what's being updated
    let sql = 'UPDATE users SET';
    const params = [];
    const updates = [];

    if (email) {
      updates.push(' email = ?');
      params.push(email);
    }
    if (user_name) {
      updates.push(' user_name = ?');
      params.push(user_name);
    }
    if (password && password !== '********') {
      // Hash new password if provided
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(' password = ?');
      params.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.sendStatus(400);
    }

    sql += updates.join(',') + ' WHERE user_id = ?';
    params.push(id);

    await pool.query(sql, params);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
});

// Get user's currencies
app.get('/api/users/:userId/currencies', async (req, res) => {
  const { userId } = req.params;
  try {
    const [[userRow]] = await pool.query(
      'SELECT primary_currency_id, secondary_currency_id FROM users WHERE user_id = ?',
      [userId]
    );
    if (!userRow) {
      return res.status(404).send('User not found');
    }

    const [[primary]] = await pool.query(
      'SELECT currency_name FROM currency WHERE currency_id = ?',
      [userRow.primary_currency_id]
    );
    const [[secondary]] = await pool.query(
      'SELECT currency_name FROM currency WHERE currency_id = ?',
      [userRow.secondary_currency_id]
    );

    res.json({
      primary_currency: primary ? primary.currency_name : null,
      secondary_currency: secondary ? secondary.currency_name : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user currencies');
  }
});

























// ========================================================

























// ========================================
// COMPLEX TRANSACTIONS ENDPOINTS
// ========================================

// 1) Get all transactions of a user (joined text, only transaction_id) VALID
app.get('/api/complex/transactions/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT 
        t.transaction_id,
        DATE_FORMAT(t.transaction_date, '%Y-%m-%d') AS transaction_date,
        t.transaction_amount,
        t.transaction_name,
        tt.transaction_type_description AS transaction_type,
        cat.transaction_category_de AS transaction_category,
        acctFrom.name AS from_account,
        acctTo.name AS to_account,
        c.symbol AS currency_symbol
      FROM transaction t
      LEFT JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
      LEFT JOIN transaction_category cat ON t.transaction_category_id = cat.transaction_category_id
      LEFT JOIN account acctFrom ON t.from_account_id = acctFrom.account_id
      LEFT JOIN account acctTo ON t.to_account_id = acctTo.account_id
      LEFT JOIN currency c ON acctFrom.currency_id = c.currency_id
      WHERE t.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving complex transactions');
  }
});

// =============================
// Update transaction endpoint
// =============================
app.put('/api/complex/transaction/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const {
    user_id,
    transaction_date,
    transaction_amount,
    transaction_name,
    transaction_type, 
    transaction_category,
    from_account,  
    to_account     
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Find the foreign keys based on text values for transaction_type
    const [[transactionTypeRow]] = await conn.query(
      'SELECT transaction_type_id FROM transaction_type WHERE transaction_type_description = ?',
      [transaction_type]
    );

    if (!transactionTypeRow) {
      throw new Error('Transaction type not found');
    }
    const transaction_type_id = transactionTypeRow.transaction_type_id;

    // 2) Handle transaction category (null for transfers)
    let transaction_category_id = null;
    if (transaction_type !== 'Transfer' && transaction_category) {
      const [[categoryRow]] = await conn.query(
        'SELECT transaction_category_id FROM transaction_category WHERE transaction_category_de = ?',
        [transaction_category]
      );

      if (categoryRow) {
        transaction_category_id = categoryRow.transaction_category_id;
      }
    }

    // 3) Find from_account_id
    const [[fromAccountRow]] = await conn.query(
      'SELECT account_id FROM account WHERE name = ? AND user_id = ?',
      [from_account, user_id]
    );

    if (!fromAccountRow) {
      throw new Error('From account not found');
    }
    const from_account_id = fromAccountRow.account_id;

    // 4) Find to_account_id (if transfer)
    let to_account_id = null;
    if (to_account) {
      const [[toAccountRow]] = await conn.query(
        'SELECT account_id FROM account WHERE name = ? AND user_id = ?',
        [to_account, user_id]
      );

      if (!toAccountRow) {
        throw new Error('To account not found');
      }
      to_account_id = toAccountRow.account_id;
    }

    // 5) Update the transaction
    await conn.query(`
      UPDATE transaction
      SET
        transaction_date = ?,
        transaction_amount = ?,
        transaction_name = ?,
        transaction_type_id = ?,
        transaction_category_id = ?,
        from_account_id = ?,
        to_account_id = ?
      WHERE transaction_id = ?
    `, [
      transaction_date,
      transaction_amount,
      transaction_name,
      transaction_type_id,
      transaction_category_id,
      from_account_id,
      to_account_id,
      transactionId
    ]);

    await conn.commit();
    res.sendStatus(200);

  } catch (err) {
    console.error('Error updating transaction:', err);
    await conn.rollback();
    res.status(500).send(err.message || 'Error updating transaction');
  } finally {
    conn.release();
  }
});

// 3) Delete a transaction by its ID Valid
app.delete('/api/complex/transaction/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  try {
    await pool.query('DELETE FROM transaction WHERE transaction_id = ?', [transactionId]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting complex transaction');
  }
});

// 4) Add a transaction given userId
app.post('/api/complex/transaction', async (req, res) => {
  const {
    user_id,
    transaction_date,
    transaction_amount,
    transaction_name,
    transaction_type,     
    transaction_category, 
    from_account,    
    to_account          
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Find the foreign keys based on text values for transaction_type and transaction_category
    const [[transactionTypeRow]] = await conn.query(
      'SELECT transaction_type_id FROM transaction_type WHERE transaction_type_description = ?',
      [transaction_type]
    );

    if (!transactionTypeRow) {
      throw new Error('Transaction type not found.');
    }
    const transaction_type_id = transactionTypeRow.transaction_type_id;

    const [[transactionCategoryRow]] = await conn.query(
      'SELECT transaction_category_id FROM transaction_category WHERE transaction_category_de = ?',
      [transaction_category]
    );

    let transaction_category_id = null;
    if (transactionCategoryRow) {
      transaction_category_id = transactionCategoryRow.transaction_category_id;
    } else {
    }

    // 2) Find the foreign keys for from_account and to_account based on account name
    const [[fromAccountRow]] = await conn.query(
      'SELECT account_id FROM account WHERE name = ? AND user_id = ?',
      [from_account, user_id]
    );

    if (!fromAccountRow) {
      throw new Error('From account not found.');
    }
    const from_account_id = fromAccountRow.account_id;

    let to_account_id = null;
    if (to_account) {
      const [[toAccountRow]] = await conn.query(
        'SELECT account_id FROM account WHERE name = ? AND user_id = ?',
        [to_account, user_id]
      );

      if (!toAccountRow) {
        throw new Error('To account not found.');
      }
      to_account_id = toAccountRow.account_id;
    }

    // 3) Insert the transaction with the new foreign keys and other fields
    const insertSql = `
      INSERT INTO transaction (
        transaction_date,
        transaction_amount,
        transaction_name,
        transaction_category_id,
        transaction_type_id,
        user_id,
        from_account_id,
        to_account_id
      ) VALUES (?,?,?,?,?,?,?,?)
    `;
    const formattedDate = new Date(transaction_date);
    await conn.query(insertSql, [
      formattedDate, 
      transaction_amount || 0, 
      transaction_name || 'Default Transaction',
      transaction_category_id,
      transaction_type_id,
      user_id,
      from_account_id,
      to_account_id
    ]);

    await conn.commit();
    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    await conn.rollback();
    res.status(500).send('Error adding complex transaction');
  } finally {
    conn.release();
  }
});




app.get('/api/accounts/:userId/currencySymbol/:accountName', async (req, res) => {
  const { userId, accountName } = req.params;
  try {
    const query = `
      SELECT c.symbol AS currency_symbol
      FROM account a
      JOIN currency c ON a.currency_id = c.currency_id
      WHERE a.user_id = ? AND a.name = ?
    `;
    const [rows] = await pool.query(query, [userId, accountName]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Account not found or no currency symbol' });
    }
    res.json({ currency_symbol: rows[0].currency_symbol });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving currency symbol');
  }
});


// ========================================
// COMPLEX USER/CURRENCY ENDPOINTS
// ========================================

// 1) Get user attributes + latest currency rate text
app.get('/api/complex/userAttributes/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userSql = `
      SELECT
        u.user_id,
        c1.currency_name AS primary_currency,
        c1.symbol AS primary_currency_symbol,
        c2.currency_name AS secondary_currency,
        c2.symbol AS secondary_currency_symbol
      FROM users u
        LEFT JOIN currency c1 ON u.primary_currency_id = c1.currency_id
        LEFT JOIN currency c2 ON u.secondary_currency_id = c2.currency_id
      WHERE u.user_id = ?
    `;
    const [[userRow]] = await pool.query(userSql, [userId]);
    if (!userRow) {
      return res.json(null);
    }
    // Latest currency rate
    const rateSql = `
      SELECT conversion_rate, DATE_FORMAT(start_date, '%Y-%m-%d') as start_date
      FROM currency_rate
      WHERE user_id = ?
      ORDER BY start_date DESC, currency_rate_id DESC
      LIMIT 1
    `;
    const [[rateRow]] = await pool.query(rateSql, [userId]);

    res.json({
      primary_currency: userRow.primary_currency,
      primary_currency_symbol: userRow.primary_currency_symbol,
      secondary_currency: userRow.secondary_currency,
      latest_rate: rateRow ? rateRow.conversion_rate : null,
      latest_rate_date: rateRow ? rateRow.start_date : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user attributes & currency rate');
  }
});

// 2) Update user currencies, delete everything except user, new currencies, stocks
app.put('/api/complex/userCurrencies/:userId', async (req, res) => {
  const { userId } = req.params;
  const { primary_currency_name, secondary_currency_name, conversion_rate } = req.body;
  const conn = await pool.getConnection();
  
  try {
    await conn.beginTransaction();

    // Get currency IDs and update user currencies
    const [[primaryCurrency]] = await conn.query(
      'SELECT currency_id FROM currency WHERE currency_name = ?',
      [primary_currency_name]
    );
    
    const [[secondaryCurrency]] = await conn.query(
      'SELECT currency_id FROM currency WHERE currency_name = ?',
      [secondary_currency_name]
    );

    if (!primaryCurrency || !secondaryCurrency) {
      throw new Error('Currency not found');
    }

    // Update user currencies
    await conn.query(
      `UPDATE users 
       SET primary_currency_id = ?, 
           secondary_currency_id = ? 
       WHERE user_id = ?`,
      [primaryCurrency.currency_id, secondaryCurrency.currency_id, userId]
    );

    // Delete existing data
    await conn.query('DELETE FROM transaction WHERE user_id = ?', [userId]);
    await conn.query('DELETE FROM account WHERE user_id = ?', [userId]);
    await conn.query('DELETE FROM currency_rate WHERE user_id = ?', [userId]);

    // Add new currency rate record with current date
    const currentDate = new Date().toISOString().slice(0, 10);
    await conn.query(
      'INSERT INTO currency_rate (conversion_rate, start_date, user_id) VALUES (?, ?, ?)',
      [conversion_rate, currentDate, userId]
    );

    await conn.commit();
    res.sendStatus(200);
  } catch (err) {
    await conn.rollback();
    console.error('Error updating currencies:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// 4) Delete everything related to the user except the user's attributes
app.delete('/api/complex/clearUser/:userId', async (req, res) => {
  const { userId } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Transactions
    await conn.query('DELETE FROM transaction WHERE user_id = ?', [userId]);
    // Accounts
    await conn.query('DELETE FROM account WHERE user_id = ?', [userId]);
    // Transaction categories
    await conn.query('DELETE FROM transaction_category WHERE user_id = ?', [userId]);
    // Currency rates
    await conn.query('DELETE FROM currency_rate WHERE user_id = ?', [userId]);
    // User stocks
    await conn.query('DELETE FROM user_stocks WHERE user_id = ?', [userId]);
    // Delete user
    await conn.query('DELETE FROM users WHERE user_id = ?', [userId]);


    await conn.commit();
    res.sendStatus(200);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send('Error clearing user data');
  } finally {
    conn.release();
  }
})


app.post('/api/register', async (req, res) => {
  const { email, password, user_name, primary_currency_name, secondary_currency_name, conversion_rate } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Check if email already exists
    const [existingUser] = await conn.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: 'A user with this email already exists'
      });
    }

    // Rest of the existing registration logic
    // 1. Get currency IDs
    const [[primaryCurrency]] = await conn.query(
      'SELECT currency_id FROM currency WHERE currency_name = ?',
      [primary_currency_name]
    );
    
    const [[secondaryCurrency]] = await conn.query(
      'SELECT currency_id FROM currency WHERE currency_name = ?',
      [secondary_currency_name]
    );

    if (!primaryCurrency || !secondaryCurrency) {
      throw new Error('Currency not found');
    }

    // 2. Create user
    const hashed = await bcrypt.hash(password, 10);
    await conn.query(
      `INSERT INTO users (
        email, 
        password, 
        user_name, 
        primary_currency_id, 
        secondary_currency_id
      ) VALUES (?, ?, ?, ?, ?)`,
      [email, hashed, user_name, primaryCurrency.currency_id, secondaryCurrency.currency_id]
    );

    // 3. Get created user's ID
    const [[userRow]] = await conn.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (!userRow) {
      throw new Error('User creation failed');
    }

    // 4. Create initial currency rate
    const currentDate = new Date().toISOString().slice(0, 10);
    await conn.query(
      `INSERT INTO currency_rate (
        conversion_rate,
        start_date,
        user_id
      ) VALUES (?, ?, ?)`,
      [conversion_rate, currentDate, userRow.user_id]
    );

    await conn.commit();
    res.status(201).json({
      message: 'Registration successful',
      userId: userRow.user_id
    });

  } catch (err) {
    await conn.rollback();
    console.error('Registration error:', err);
    res.status(500).json({
      error: 'Registration failed',
      details: err.message
    });
  } finally {
    conn.release();
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id,
        userName: user.user_name 
      }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      userId: user.user_id,
      userName: user.user_name
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/protected', (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send('Missing token');
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Access granted', userId: decoded.userId });
  } catch (err) {
    res.status(403).send('Invalid or expired token');
  }
});

app.get('/api/exportUserData/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('UserData');

    // Fetch user data with currency information
    const [userRows] = await pool.query(`
      SELECT 
        u.email,
        u.user_name,
        c1.currency_name as primary_currency,
        c2.currency_name as secondary_currency
      FROM users u
      LEFT JOIN currency c1 ON u.primary_currency_id = c1.currency_id
      LEFT JOIN currency c2 ON u.secondary_currency_id = c2.currency_id
      WHERE u.user_id = ?
    `, [userId]);

    // Fetch accounts with full details
    const [accounts] = await pool.query(`
      SELECT 
        a.name,
        a.total_amount,
        at.account_type_description,
        c.currency_name
      FROM account a
      JOIN account_type at ON a.account_type_id = at.account_type_id
      JOIN currency c ON a.currency_id = c.currency_id
      WHERE a.user_id = ?
    `, [userId]);

    // Fetch transactions with full details
    const [transactions] = await pool.query(`
      SELECT 
        DATE_FORMAT(t.transaction_date, '%Y-%m-%d') as transaction_date,
        t.transaction_amount,
        t.transaction_name,
        tt.transaction_type_description as type,
        tc.transaction_category_de as category,
        af.name as from_account,
        at.name as to_account,
        c.currency_name as currency
      FROM transaction t
      JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
      LEFT JOIN transaction_category tc ON t.transaction_category_id = tc.transaction_category_id
      JOIN account af ON t.from_account_id = af.account_id
      LEFT JOIN account at ON t.to_account_id = at.account_id
      JOIN currency c ON af.currency_id = c.currency_id
      WHERE t.user_id = ?
      ORDER BY t.transaction_date DESC
    `, [userId]);

    // Add user information
    sheet.addRow(['User Information']);
    sheet.addRow(['Email', 'Username', 'Primary Currency', 'Secondary Currency']);
    sheet.addRow([
      userRows[0].email,
      userRows[0].user_name,
      userRows[0].primary_currency,
      userRows[0].secondary_currency
    ]);

    // Add accounts section
    sheet.addRow([]);
    sheet.addRow(['Accounts']);
    sheet.addRow(['Name', 'Balance', 'Type', 'Currency']);
    accounts.forEach(acc => {
      sheet.addRow([
        acc.name,
        acc.total_amount,
        acc.account_type_description,
        acc.currency_name
      ]);
    });

    // Add transactions section
    sheet.addRow([]);
    sheet.addRow(['Transactions']);
    sheet.addRow(['Date', 'Amount', 'Name', 'Type', 'Category', 'From Account', 'To Account', 'Currency']);
    transactions.forEach(txn => {
      sheet.addRow([
        txn.transaction_date,
        txn.transaction_amount,
        txn.transaction_name,
        txn.type,
        txn.category,
        txn.from_account,
        txn.to_account || '-',
        txn.currency
      ]);
    });

    // Add some basic formatting
    sheet.getColumn(1).width = 15;  
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 15; 
    sheet.getColumn(5).width = 15;
    sheet.getColumn(6).width = 20;
    sheet.getColumn(7).width = 20;
    sheet.getColumn(8).width = 15;

    // Set headers and send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=user_data.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting user data:', err);
    res.status(500).json({ error: 'Failed to export data' });
  }
});