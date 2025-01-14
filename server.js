const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./src/db'); // Make sure the path is correct

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

