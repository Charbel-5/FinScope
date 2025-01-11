-- ===========================================================

-- 1) Drop existing tables in reverse dependency order

--    so the CREATE statements won't fail on re-run

-- ===========================================================

BEGIN

   EXECUTE IMMEDIATE 'DROP TABLE TRANSACTION CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE CURRENCY_RATE CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE CURRENCY_SETTING CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE USER_STOCKS CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE ACCOUNT CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE TRANSACTION_TYPE CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE TRANSACTION_CATEGORY CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE ACCOUNT_TYPE CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE CURRENCY CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE CURRENCY_SETTING_TYPE CASCADE CONSTRAINTS';

   EXECUTE IMMEDIATE 'DROP TABLE USERS CASCADE CONSTRAINTS';

EXCEPTION

   WHEN OTHERS THEN

      -- Ignore "table or view does not exist"

      IF SQLCODE != -942 THEN

         RAISE;

      END IF;

END;

/

-- ===========================================================

-- 2) Create parent tables first

-- ===========================================================
 
CREATE TABLE USERS (

    user_id       NUMBER(10) NOT NULL,

    email         VARCHAR2(100) NOT NULL,

    password      VARCHAR2(100) NOT NULL,

    user_name     VARCHAR2(100) NOT NULL,

    CONSTRAINT pk_users PRIMARY KEY (user_id)

);
 
CREATE TABLE CURRENCY_SETTING_TYPE (

    currency_setting_type_id    NUMBER(10) NOT NULL,

    currency_setting_type_de VARCHAR2(200) NOT NULL,

    CONSTRAINT pk_curr_set_type PRIMARY KEY (currency_setting_type_id)

);
 
CREATE TABLE CURRENCY (

    currency_id   NUMBER(10) NOT NULL,

    currency_name VARCHAR2(100) NOT NULL,

    symbol        VARCHAR2(10) NOT NULL,

    CONSTRAINT pk_currency PRIMARY KEY (currency_id)

);
 
CREATE TABLE ACCOUNT_TYPE (

    account_type_id          NUMBER(10) NOT NULL,

    account_type_description VARCHAR2(200) NOT NULL,

    CONSTRAINT pk_account_type PRIMARY KEY (account_type_id)

);
 
CREATE TABLE TRANSACTION_CATEGORY (

    transaction_category_id          NUMBER(10) NOT NULL,

    transaction_category_de VARCHAR2(200) NOT NULL,

    CONSTRAINT pk_txn_category PRIMARY KEY (transaction_category_id)

);
 
CREATE TABLE TRANSACTION_TYPE (

    transaction_type_id          NUMBER(10) NOT NULL,

    transaction_type_description VARCHAR2(200) NOT NULL,

    CONSTRAINT pk_txn_type PRIMARY KEY (transaction_type_id)

);
 
-- ===========================================================

-- 3) Create child tables that reference the parents

-- ===========================================================
 
CREATE TABLE ACCOUNT (

    account_id      NUMBER(10) NOT NULL,

    name            VARCHAR2(200) NOT NULL,

    total_amount    NUMBER(15,5) NOT NULL,

    account_type_id NUMBER(10) NOT NULL,
    
    user_id         NUMBER(10) NOT NULL,

    currency_setting_id NUMBER(10) NOT NULL,

    CONSTRAINT pk_account PRIMARY KEY (account_id),

    CONSTRAINT fk_acct_accttype 

       FOREIGN KEY (account_type_id)

       REFERENCES ACCOUNT_TYPE (account_type_id)

    CONSTRAINT fk_usr 

       FOREIGN KEY (user_id)

       REFERENCES USERS (user_id)

    CONSTRAINT fk_curr_sett

       FOREIGN KEY (currency_setting_id)

       REFERENCES CURRENCY_SETTING (currency_setting_id)

);
 
CREATE TABLE USER_STOCKS (

    stock_id      NUMBER(10) NOT NULL,

    stock_ticker  VARCHAR2(20) NOT NULL,

    stock_amount  NUMBER(15,4) NOT NULL,

    user_id       NUMBER(10) NOT NULL,

    CONSTRAINT pk_user_stocks PRIMARY KEY (stock_id),

    CONSTRAINT fk_usrstocks_user

       FOREIGN KEY (user_id)

       REFERENCES USERS (user_id)

);
 
CREATE TABLE CURRENCY_SETTING (

    currency_setting_id     NUMBER(10) NOT NULL,

    user_id                  NUMBER(10) NOT NULL,

    currency_id              NUMBER(10) NOT NULL,

    currency_setting_type_id NUMBER(10) NOT NULL,

    CONSTRAINT pk_curr_setting 

       PRIMARY KEY (currency_setting_id),

    CONSTRAINT fk_curr_set_user

       FOREIGN KEY (user_id)

       REFERENCES USERS (user_id),

    CONSTRAINT fk_curr_set_currency

       FOREIGN KEY (currency_id)

       REFERENCES CURRENCY (currency_id),

    CONSTRAINT fk_curr_set_type

       FOREIGN KEY (currency_setting_type_id)

       REFERENCES CURRENCY_SETTING_TYPE (currency_setting_type_id)

);
 
CREATE TABLE CURRENCY_RATE (

    currency_rate_id     NUMBER(10) NOT NULL,

    conversion_rate      NUMBER(15,6) NOT NULL,

    start_date           DATE NOT NULL,

    currency_setting_id NUMBER(10) NOT NULL,

    CONSTRAINT pk_curr_rate 

       PRIMARY KEY (currency_rate_id),

    -- Shortened constraint name to avoid ORA-00972

    CONSTRAINT fk_curr_rate_curr_set 

       FOREIGN KEY (currency_setting_id)

       REFERENCES CURRENCY_SETTING (currency_setting_id)

);
 
CREATE TABLE TRANSACTION (

    transaction_id           NUMBER(10) NOT NULL,

    transaction_date         DATE NOT NULL,

    transaction_amount       NUMBER(15,2) NOT NULL,

    transaction_name         VARCHAR2(200) NOT NULL,

    transaction_category_id  NUMBER(10),

    transaction_type_id      NUMBER(10) NOT NULL,

    user_id               NUMBER(10) NOT NULL,   -- "Created By" user

    from_account_id          NUMBER(10) NOT NULL,   -- "From" account

    to_account_id            NUMBER(10),   -- "transfer to" account,

    currency_setting_id       NUMBER(10) NOT NULL,

    CONSTRAINT pk_transaction 

       PRIMARY KEY (transaction_id),

    CONSTRAINT fk_txn_category

       FOREIGN KEY (transaction_category_id)

       REFERENCES TRANSACTION_CATEGORY (transaction_category_id),

    CONSTRAINT fk_txn_type

       FOREIGN KEY (transaction_type_id)

       REFERENCES TRANSACTION_TYPE (transaction_type_id),

    CONSTRAINT fk_txn_user

       FOREIGN KEY (user_id)

       REFERENCES USERS (user_id),

    CONSTRAINT fk_txn_from_acct

       FOREIGN KEY (from_account_id)

       REFERENCES ACCOUNT (account_id),

    CONSTRAINT fk_txn_to_acct

       FOREIGN KEY (to_account_id)

       REFERENCES ACCOUNT (account_id)

    CONSTRAINT fk_curr_sett_id

       FOREIGN KEY (currency_setting_id)

       REFERENCES CURRENCY_SETTING (currency_setting_id)

);
 
-- ===========================================================

-- 4) (Optional) Create sequences/triggers for auto-increment

--    (If desired and supported by your Oracle version)

-- ===========================================================

/*

CREATE SEQUENCE seq_users START WITH 1 INCREMENT BY 1;
 
CREATE OR REPLACE TRIGGER trg_users

BEFORE INSERT ON USERS

FOR EACH ROW

WHEN (NEW.user_id IS NULL)

BEGIN

  SELECT seq_users.NEXTVAL

  INTO   :NEW.user_id

  FROM   DUAL;

END;

/

*/

 