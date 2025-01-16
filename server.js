const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

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
           to_account_id,
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
    const [rows] = await pool.query('SELECT * FROM account WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving accounts');
  }
});


// Create an account
app.post('/api/accounts', async (req, res) => {
  const { name, total_amount, account_type_id, user_id, currency_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO account (
         name, total_amount, account_type_id, user_id, currency_id
       ) VALUES (?,?,?,?,?)`,
      [name, total_amount, account_type_id, user_id, currency_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating account');
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
    const dateObject = new Date(start_date); // Convert start_date to Date object
    await pool.query(
      `INSERT INTO currency_rate (conversion_rate, start_date, user_id)
       VALUES (?,?,?)`,
      [conversion_rate, dateObject, user_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating currency_rate');
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
  const { email, password, user_name, primary_currency_id, secondary_currency_id } = req.body;
  try {
    await pool.query(
      `UPDATE users
       SET email = ?,
           password = ?,
           user_name = ?,
           primary_currency_id = ?,
           secondary_currency_id = ?
       WHERE user_id = ?`,
      [email, password, user_name, primary_currency_id, secondary_currency_id, id]
    );
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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
        acctTo.name AS to_account
      FROM transaction t
      LEFT JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
      LEFT JOIN transaction_category cat ON t.transaction_category_id = cat.transaction_category_id
      LEFT JOIN account acctFrom ON t.from_account_id = acctFrom.account_id
      LEFT JOIN account acctTo ON t.to_account_id = acctTo.account_id
      WHERE t.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving complex transactions');
  }
});

//Editing the transaction using its id, and texts VALID
app.put('/api/complex/transaction/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const {
    transaction_date,
    transaction_amount,
    transaction_name,
    transaction_type,      // e.g. "Expense"
    transaction_category,  // e.g. "Bonus"
    from_account,          // e.g. "Bob Savings"
    to_account             // e.g. null or "Alice Checking"
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
      // If the category doesn't exist, create a new one
      const [newCategoryResult] = await conn.query(
        'INSERT INTO transaction_category (transaction_category_de, user_id, transaction_type_id) VALUES (?, ?, ?)',
        [transaction_category, existingTx.user_id, transaction_type_id]
      );
      transaction_category_id = newCategoryResult.insertId;
    }

    // 2) Find the foreign keys for from_account and to_account based on account name
    const [[fromAccountRow]] = await conn.query(
      'SELECT account_id FROM account WHERE name = ?',
      [from_account]
    );

    if (!fromAccountRow) {
      throw new Error('From account not found.');
    }
    const from_account_id = fromAccountRow.account_id;

    let to_account_id = null;
    if (to_account) {
      const [[toAccountRow]] = await conn.query(
        'SELECT account_id FROM account WHERE name = ?',
        [to_account]
      );

      if (!toAccountRow) {
        throw new Error('To account not found.');
      }
      to_account_id = toAccountRow.account_id;
    }

    // 3) Update the transaction with the new foreign keys and other fields
    await conn.query(`
      UPDATE transaction
      SET
        transaction_date   = ?,
        transaction_amount = ?,
        transaction_name   = ?,
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
    console.error(err);
    await conn.rollback();
    res.status(500).send('Error editing complex transaction');
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

// 4) Add a transaction given userId + text attributes
app.post('/api/complex/transactions', async (req, res) => {
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

    // Format the date to 'YYYY-MM-DD'
    const formattedDate = new Date(transaction_date).toISOString().split('T')[0];

    // Resolve transaction_type_id or assign a default
    let transaction_type_id;
    const [[typeRow]] = await conn.query(
      'SELECT transaction_type_id FROM transaction_type WHERE transaction_type_description = ? AND (user_id = ? OR user_id = 1)',
      [transaction_type, user_id]
    );
    if (typeRow) {
      transaction_type_id = typeRow.transaction_type_id;
    } else {
      // Insert a default transaction type and use its ID
      const [newTypeResult] = await conn.query(
        'INSERT INTO transaction_type (transaction_type_description) VALUES (?)',
        ['Default Type']
      );
      transaction_type_id = newTypeResult.insertId;
    }

    // Resolve transaction_category_id or assign a default
    let transaction_category_id;
    const [[catRow]] = await conn.query(
      'SELECT transaction_category_id FROM transaction_category WHERE transaction_category_de = ? AND (user_id = ? OR user_id = 1)',
      [transaction_category, user_id]
    );
    if (catRow) {
      transaction_category_id = catRow.transaction_category_id;
    } else {
      // Insert a default transaction category and use its ID
      const [newCategoryResult] = await conn.query(
        'INSERT INTO transaction_category (transaction_category_de, user_id, transaction_type_id) VALUES (?, ?, ?)',
        ['Default Category', user_id, transaction_type_id]
      );
      transaction_category_id = newCategoryResult.insertId;
    }

    // Resolve from_account_id or assign a default
    let from_account_id;
    const [[acctFromRow]] = await conn.query(
      'SELECT account_id FROM account WHERE name = ? AND (user_id = ? OR user_id = 1)',
      [from_account, user_id]
    );
    if (acctFromRow) {
      from_account_id = acctFromRow.account_id;
    } else {
      // Insert a default account and use its ID
      const [newAccountResult] = await conn.query(
        'INSERT INTO account (name, total_amount, account_type_id, user_id, currency_id) VALUES (?, ?, ?, ?, ?)',
        ['Default From Account', 0, 1, user_id, 1] // Default values
      );
      from_account_id = newAccountResult.insertId;
    }

    // Resolve to_account_id or assign a default
    let to_account_id;
    if (to_account) {
      const [[acctToRow]] = await conn.query(
        'SELECT account_id FROM account WHERE name = ? AND (user_id = ? OR user_id = 1)',
        [to_account, user_id]
      );
      if (acctToRow) {
        to_account_id = acctToRow.account_id;
      } else {
        // Insert a default account and use its ID
        const [newAccountResult] = await conn.query(
          'INSERT INTO account (name, total_amount, account_type_id, user_id, currency_id) VALUES (?, ?, ?, ?, ?)',
          ['Default To Account', 0, 1, user_id, 1] // Default values
        );
        to_account_id = newAccountResult.insertId;
      }
    } else {
      // If no to_account is provided, use a default account
      const [newAccountResult] = await conn.query(
        'INSERT INTO account (name, total_amount, account_type_id, user_id, currency_id) VALUES (?, ?, ?, ?, ?)',
        ['Default To Account', 0, 1, user_id, 1]
      );
      to_account_id = newAccountResult.insertId;
    }

    // Insert the new transaction with no NULL values
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
    await conn.query(insertSql, [
      formattedDate, // Use the properly formatted date
      transaction_amount || 0, // Default amount if missing
      transaction_name || 'Default Transaction', // Default name if missing
      transaction_category_id,
      transaction_type_id,
      user_id,
      from_account_id,
      to_account_id
    ]);

    await conn.commit();
    res.sendStatus(201);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send('Error adding complex transaction');
  } finally {
    conn.release();
  }
});





// ========================================
// COMPLEX USER/CURRENCY ENDPOINTS
// ========================================

// 1) Get user attributes + latest currency rate text
app.get('/api/complex/userAttributes/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Basic user info
    const userSql = `
      SELECT
        u.user_id,
        c1.currency_name AS primary_currency,
        c2.currency_name AS secondary_currency
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
      ORDER BY start_date DESC
      LIMIT 1
    `;
    const [[rateRow]] = await pool.query(rateSql, [userId]);

    res.json({
      user_id: userRow.user_id, // or remove if you want no ID at all
      primary_currency: userRow.primary_currency,
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
  const { primary_currency_name, secondary_currency_name } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Look up the currency IDs from names
    const [[pRow]] = await conn.query(
      'SELECT currency_id FROM currency WHERE currency_name = ?',
      [primary_currency_name]
    );
    const primary_currency_id = pRow?.currency_id || null;

    const [[sRow]] = await conn.query(
      'SELECT currency_id FROM currency WHERE currency_name = ?',
      [secondary_currency_name]
    );
    const secondary_currency_id = sRow?.currency_id || null;

    // Update user table
    await conn.query(
      `UPDATE users
       SET primary_currency_id = ?,
           secondary_currency_id = ?
       WHERE user_id = ?`,
      [primary_currency_id, secondary_currency_id, userId]
    );

    // Delete everything except user, new currencies, and stocks
    // transaction
    await conn.query('DELETE FROM transaction WHERE user_id = ?', [userId]);
    // accounts
    await conn.query('DELETE FROM account WHERE user_id = ?', [userId]);
    // transaction_category
    await conn.query('DELETE FROM transaction_category WHERE user_id = ?', [userId]);
    // currency_rate
    await conn.query('DELETE FROM currency_rate WHERE user_id = ?', [userId]);
    // Keep user_stocks (no deletion)

    await conn.commit();
    res.sendStatus(200);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send('Error updating user currencies');
  } finally {
    conn.release();
  }
});

// 3) Add a currency rate with system date
app.post('/api/complex/userCurrenciesRate', async (req, res) => {
  const { user_id, conversion_rate } = req.body;
  try {
    const now = new Date();
    await pool.query(
      `INSERT INTO currency_rate (conversion_rate, start_date, user_id)
       VALUES (?,?,?)`,
      [conversion_rate, now, user_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding currency rate');
  }
});

// 4) Delete everything related to the user except the user’s attributes
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
    // Keep user row itself

    await conn.commit();
    res.sendStatus(200);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send('Error clearing user data');
  } finally {
    conn.release();
  }
});