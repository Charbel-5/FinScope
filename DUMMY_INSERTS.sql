
-- ----------------------------------------------------
-- START TRANSACTION
-- ----------------------------------------------------
START TRANSACTION;


-- 2) Insert some users, referencing valid currency IDs for primary/secondary
INSERT INTO users (
    email,
    password,
    user_name,
    primary_currency_id,
    secondary_currency_id
)
VALUES
    ('alice@example.com', 'passAlice', 'Alice', 1, 2),  -- primary=USD, secondary=EUR
    ('bob@example.com',   'passBob',   'Bob',   2, 3),  -- primary=EUR, secondary=GBP
    ('charlie@example.com','passC',    'Charlie',3, 1); -- primary=GBP, secondary=USD




-- 6) Insert some currency_rate rows (ties to currency_id and optionally user_id)
--    Suppose each user can store custom conversion rates for certain currencies.
INSERT INTO currency_rate (
    conversion_rate,
    start_date,
    user_id
)
VALUES
    (1.0000, '2025-01-01', 1),  -- user1, USD
    (0.9200, '2025-01-01', 1),  -- user1, EUR
    (1.0100, '2025-01-05', 2),  -- user2, EUR
    (0.7800, '2025-01-10', 2),  -- user2, GBP
    (0.0074, '2025-01-15', 3);  -- user3, JPY

-- 7) Insert some accounts (ties to user_id, currency_id, account_type_id)
INSERT INTO account (
    name,
    total_amount,
    account_type_id,
    user_id,
    currency_id
)
VALUES
    ('Alice Checking',   1000.00, 1, 1, 1),  -- Cash for Alice in USD
    ('Alice CreditCard',   200.00, 2, 1, 1),  -- Card for Alice, also USD
    ('Bob Savings',      1500.00, 3, 2, 2),  -- Savings for Bob in EUR
    ('Bob Loan',         -500.00, 4, 2, 2),  -- Loan for Bob, EUR
    ('Charlie Wallet',     50.00, 1, 3, 3),  -- Cash for Charlie in GBP
    ('Charlie Reserve',   300.00, 3, 3, 3);  -- Savings for Charlie, GBP

-- 8) Insert some user_stocks (ties to user_id)
INSERT INTO user_stocks (
    stock_ticker,
    stock_amount,
    user_id
)
VALUES
    ('AAPL',  10.5, 1),
    ('TSLA',   3.0, 1),
    ('GOOGL',  2.0, 2),
    ('AMZN',   5.0, 2),
    ('MSFT',   1.0, 3),
    ('NFLX',   4.5, 3);

-- 9) Finally, insert some transactions
--    Fields: (transaction_date, transaction_amount, transaction_name,
--    transaction_category_id, transaction_type_id, user_id,
--    from_account_id, to_account_id)
--
--    We'll do a mix of Income, Expense, Transfer, referencing the correct IDs.
--    Some categories might be NULL, or we can pick from the ones we inserted (IDs 1..7).
INSERT INTO transaction (
    transaction_date,
    transaction_amount,
    transaction_name,
    transaction_category_id,
    transaction_type_id,
    user_id,
    from_account_id,
    to_account_id
)
VALUES
    -- Alice receives Salary (Income)
    ('2025-02-01', 2000.00, 'February Salary',    1, 1, 1, 1, NULL),
    
    -- Alice pays Credit Card Bill (Expense)
    ('2025-02-02', 200.00, 'CC Payment',          2, 2, 1, 2, NULL),
    
    -- Bob pays Rent (Expense)
    ('2025-02-01', 800.00,  'Monthly Rent',       4, 2, 2, 3, NULL),
    
    -- Bob pays Utilities (Expense)
    ('2025-02-05', 120.00,  'Utilities Bill',     5, 2, 2, 3, NULL),
    
    -- Charlie transfers money between accounts (Transfer)
    ('2025-02-01', 100.00,  'Move to Reserve',    7, 3, 3, 5, 6),
    
    -- Bob moves money from his Savings to pay off Loan (Transfer)
    ('2025-02-03', 200.00,  'Pay Loan',           7, 3, 2, 3, 4),

    -- Alice receives a Bonus (Income)
    ('2025-02-15', 500.00,  'Mid-month Bonus',    2, 1, 1, 1, NULL);



-- ----------------------------------------------------
-- COMMIT everything
-- ----------------------------------------------------
COMMIT;
