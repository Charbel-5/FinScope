const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./src/db'); // Make sure the path is correct

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());




// API to retrieve all transactions for a specific account
app.get('/api/account-transactions/:accountId', async (req, res) => {
  const { accountId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM transaction WHERE from_account_id = ? OR to_account_id = ?', [accountId, accountId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving account transactions');
  }
});

// API to retrieve all currency rates
app.get('/api/currency-rates', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM currency_rate');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving currency rates');
  }
});




















///////////     Transactions     ///////////


// 1) Get all transactions for a specific user
app.get('/api/:userId/transactions', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transaction WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving transactions');
  }
});


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
               to_account_id = ?,
               currency_setting_id = ?
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
          transactionObj.currency_setting_id,
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
           currency_setting_id
         ) VALUES (?,?,?,?,?,?,?,?,?)`,
         [
          new Date(transactionObj.transaction_date),
          transactionObj.transaction_amount,
          transactionObj.transaction_name,
          transactionObj.transaction_category_id,
          transactionObj.transaction_type_id,
          transactionObj.user_id,
          transactionObj.from_account_id,
          transactionObj.to_account_id || null,
          transactionObj.currency_setting_id,
        ]
      );
      res.sendStatus(201);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving transaction');
  }
});


// 3) Delete a transaction by its ID
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





// 1) Get accounts for a specific user
app.get('/api/accounts/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM account WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving accounts');
  }
});




// 1) Get user attributes (primary, secondary currencies) + latest currency rate
app.get('/api/users/:userId/attributes', async (req, res) => {
  const { userId } = req.params;
  try {
    const [[userRow]] = await pool.query(
      `SELECT primary_currency_id, secondary_currency_id 
       FROM users
       WHERE user_id = ?`,
      [userId]
    );
    const [[rateRow]] = await pool.query(
      `SELECT * 
       FROM currency_rate 
       WHERE user_id = ?
       ORDER BY rate_date DESC
       LIMIT 1`,
      [userId]
    );
    res.json({ ...userRow, latestRate: rateRow || null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user attributes');
  }
});






// 2) Update user attributes (primary, secondary currencies)
app.put('/api/users/:userId/attributes', async (req, res) => {
  const { userId } = req.params;
  const { primaryCurrency, secondaryCurrency } = req.body;
  try {
    await pool.query(
      `UPDATE users
       SET primary_currency = ?, secondary_currency = ?
       WHERE user_id = ?`,
      [primaryCurrency, secondaryCurrency, userId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user attributes');
  }
});

// 3) Add a currency rate for the user with the system date
app.post('/api/users/:userId/currency-rate', async (req, res) => {
  const { userId } = req.params;
  const { rateValue } = req.body;
  const currentDate = new Date();
  try {
    await pool.query(
      `INSERT INTO currency_rate (user_id, rate_date, rate_value)
       VALUES (?,?,?)`,
      [userId, currentDate, rateValue]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting currency rate');
  }
});

// 4) Delete everything related to a user except the user’s attributes
app.delete('/api/users/:userId/purge', async (req, res) => {
  const { userId } = req.params;
  try {
    await pool.query('DELETE FROM transaction WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM account WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM currency_rate WHERE user_id = ?', [userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error purging user data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Close the database connection pool on exit
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});