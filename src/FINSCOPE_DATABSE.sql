--

-- 0) Disable FK checks so we can drop without errors

--

SET FOREIGN_KEY_CHECKS = 0;


CREATE DATABASE finscope;

USE finscope;
 
 
-- =====================

-- 1) Drop existing tables (reverse order of dependencies)

-- =====================

DROP TABLE IF EXISTS `transaction`;

DROP TABLE IF EXISTS `currency_rate`;

DROP TABLE IF EXISTS `user_stocks`;

DROP TABLE IF EXISTS `account`;

DROP TABLE IF EXISTS `transaction_category`;

DROP TABLE IF EXISTS `transaction_type`;

DROP TABLE IF EXISTS `account_type`;

DROP TABLE IF EXISTS `currency`;

DROP TABLE IF EXISTS `users`;
 
-- Re-enable FK checks

SET FOREIGN_KEY_CHECKS = 1;
 
-- ===========================================================

-- 2) Create parent tables

-- ===========================================================

CREATE TABLE `currency` (

    `currency_id`   INT NOT NULL AUTO_INCREMENT,

    `currency_name` VARCHAR(100) NOT NULL,

    `symbol`        VARCHAR(10)  NOT NULL,

    PRIMARY KEY (`currency_id`)

) ENGINE=InnoDB;
 
CREATE TABLE `users` (

    `user_id`     INT NOT NULL AUTO_INCREMENT,

    `email`       VARCHAR(100) NOT NULL,

    `password`    VARCHAR(100) NOT NULL,

    `user_name`   VARCHAR(100) NOT NULL,
 
    -- Add two columns referencing "primary" and "secondary" currencies

    `primary_currency_id`   INT NULL,

    `secondary_currency_id` INT NULL,

    PRIMARY KEY (`user_id`),
 
    CONSTRAINT `fk_user_primary_currency`

      FOREIGN KEY (`primary_currency_id`)

      REFERENCES `currency` (`currency_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_user_secondary_currency`

      FOREIGN KEY (`secondary_currency_id`)

      REFERENCES `currency` (`currency_id`)

      ON DELETE CASCADE

) ENGINE=InnoDB;
 
CREATE TABLE `account_type` (

    `account_type_id`          INT NOT NULL AUTO_INCREMENT,

    `account_type_description` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`account_type_id`)

) ENGINE=InnoDB;
 
CREATE TABLE `transaction_type` (

    `transaction_type_id`          INT NOT NULL AUTO_INCREMENT,

    `transaction_type_description` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`transaction_type_id`)

) ENGINE=InnoDB;
 
CREATE TABLE `transaction_category` (

    `transaction_category_id` INT NOT NULL AUTO_INCREMENT,

    `transaction_category_de` VARCHAR(200) NOT NULL,

    `transaction_type_id`     INT NOT NULL,

    PRIMARY KEY (`transaction_category_id`),

    CONSTRAINT `fk_txn_cat_type`

      FOREIGN KEY (`transaction_type_id`)

      REFERENCES `transaction_type` (`transaction_type_id`)

      ON DELETE CASCADE

) ENGINE=InnoDB;
 
-- ===========================================================

-- 3) Child tables

-- ===========================================================

CREATE TABLE `currency_rate` (

    `currency_rate_id` INT NOT NULL AUTO_INCREMENT,

    `conversion_rate`  DECIMAL(15,6) NOT NULL,

    `start_date`       DATE          NOT NULL,
 
    `user_id`     INT NULL,
 
    PRIMARY KEY (`currency_rate_id`),
 
    CONSTRAINT `fk_curr_rate_user`

      FOREIGN KEY (`user_id`)

      REFERENCES `users` (`user_id`)

      ON DELETE CASCADE

) ENGINE=InnoDB;
 
CREATE TABLE `account` (

    `account_id`   INT NOT NULL AUTO_INCREMENT,

    `name`         VARCHAR(200) NOT NULL,  -- matches diagram label "Name"

    `total_amount` DECIMAL(15,2) NOT NULL,
 
    `account_type_id` INT NOT NULL,

    `user_id`         INT NOT NULL,
 
    -- References currency directly (rather than a separate "currency_setting" table)

    `currency_id` INT NOT NULL,

    PRIMARY KEY (`account_id`),
 
    CONSTRAINT `fk_acct_accttype`

      FOREIGN KEY (`account_type_id`)

      REFERENCES `account_type` (`account_type_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_account_user`

      FOREIGN KEY (`user_id`)

      REFERENCES `users` (`user_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_account_currency`

      FOREIGN KEY (`currency_id`)

      REFERENCES `currency` (`currency_id`)

      ON DELETE CASCADE

) ENGINE=InnoDB;
 
CREATE TABLE `user_stocks` (

    `stock_id`      INT NOT NULL AUTO_INCREMENT,

    `stock_ticker`  VARCHAR(20)   NOT NULL,

    `stock_amount`  DECIMAL(15,4) NOT NULL,

    `user_id`       INT NOT NULL,

    PRIMARY KEY (`stock_id`),
 
    CONSTRAINT `fk_usrstocks_user`

      FOREIGN KEY (`user_id`)

      REFERENCES `users` (`user_id`)

      ON DELETE CASCADE

) ENGINE=InnoDB;
 
-- Note: "transaction" is a reserved word, so we use backticks.

-- We remove the currency_id column entirely here.
 
CREATE TABLE `transaction` (

    `transaction_id`     INT NOT NULL AUTO_INCREMENT,

    `transaction_date`   DATE         NOT NULL,

    `transaction_amount` DECIMAL(15,2) NOT NULL,

    `transaction_name`   VARCHAR(200) NOT NULL,
 
    `transaction_category_id` INT NULL,

    `transaction_type_id`     INT NOT NULL,

    `user_id`                 INT NOT NULL,
 
    -- For transfers

    `from_account_id` INT NOT NULL,

    `to_account_id`   INT NULL,
 
    PRIMARY KEY (`transaction_id`),
 
    CONSTRAINT `fk_txn_category`

      FOREIGN KEY (`transaction_category_id`)

      REFERENCES `transaction_category` (`transaction_category_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_txn_type`

      FOREIGN KEY (`transaction_type_id`)

      REFERENCES `transaction_type` (`transaction_type_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_txn_user`

      FOREIGN KEY (`user_id`)

      REFERENCES `users` (`user_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_txn_from_acct`

      FOREIGN KEY (`from_account_id`)

      REFERENCES `account` (`account_id`)

      ON DELETE CASCADE,
 
    CONSTRAINT `fk_txn_to_acct`

      FOREIGN KEY (`to_account_id`)

      REFERENCES `account` (`account_id`)

      ON DELETE CASCADE

) ENGINE=InnoDB;
