DELIMITER //

-- Modified get_conversion_rate function to consider transaction date
CREATE FUNCTION get_conversion_rate(
    p_user_id INT,
    p_from_currency INT,
    p_to_currency INT,
    p_transaction_date DATE
) RETURNS DECIMAL(15,6)
DETERMINISTIC
BEGIN
    DECLARE v_rate DECIMAL(15,6);
    
    -- Return 1 if same currency
    IF p_from_currency = p_to_currency THEN
        RETURN 1;
    END IF;
    
    -- Get the rate closest to but not after the transaction date
    SELECT conversion_rate INTO v_rate
    FROM currency_rate 
    WHERE user_id = p_user_id
    AND start_date <= p_transaction_date
    ORDER BY start_date DESC
    LIMIT 1;
    
    RETURN COALESCE(v_rate, 1);
END //

-- AFTER INSERT trigger
CREATE TRIGGER after_transaction_insert 
AFTER INSERT ON `transaction`
FOR EACH ROW
BEGIN
    DECLARE from_currency, to_currency INT;
    DECLARE conv_rate DECIMAL(15,6);
    
    -- For all transaction types
    SELECT currency_id INTO from_currency
    FROM account WHERE account_id = NEW.from_account_id;
    
    IF NEW.to_account_id IS NOT NULL THEN
        -- Transfer case
        SELECT currency_id INTO to_currency
        FROM account WHERE account_id = NEW.to_account_id;
        SET conv_rate = get_conversion_rate(NEW.user_id, from_currency, to_currency, NEW.transaction_date);
        
        -- From account: subtract original amount
        UPDATE account 
        SET total_amount = total_amount - ABS(NEW.transaction_amount)
        WHERE account_id = NEW.from_account_id;
        
        -- To account: apply conversion based on currency order
        IF from_currency < to_currency THEN
            -- Converting to higher currency (e.g., LBP to USD)
            UPDATE account 
            SET total_amount = total_amount + (ABS(NEW.transaction_amount) / conv_rate)
            WHERE account_id = NEW.to_account_id;
        ELSE
            -- Converting to lower currency (e.g., USD to LBP)
            UPDATE account 
            SET total_amount = total_amount + (ABS(NEW.transaction_amount) * conv_rate)
            WHERE account_id = NEW.to_account_id;
        END IF;
    ELSE
        -- Income/Expense case
        IF NEW.transaction_type_id = 1 THEN -- Income
            UPDATE account 
            SET total_amount = total_amount + ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        ELSE -- Expense
            UPDATE account 
            SET total_amount = total_amount - ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        END IF;
    END IF;
END //

-- AFTER UPDATE trigger
CREATE TRIGGER after_transaction_update
AFTER UPDATE ON `transaction`
FOR EACH ROW
BEGIN
    DECLARE from_currency, to_currency, old_from_currency, old_to_currency INT;
    DECLARE conv_rate DECIMAL(15,6);
    
    -- Reverse old transaction
    IF OLD.to_account_id IS NOT NULL THEN
        -- Reverse old transfer
        SELECT currency_id INTO old_from_currency
        FROM account WHERE account_id = OLD.from_account_id;
        SELECT currency_id INTO old_to_currency
        FROM account WHERE account_id = OLD.to_account_id;
        
        SET conv_rate = get_conversion_rate(OLD.user_id, old_from_currency, old_to_currency, OLD.transaction_date);
        
        UPDATE account 
        SET total_amount = total_amount + ABS(OLD.transaction_amount)
        WHERE account_id = OLD.from_account_id;
        
        IF old_from_currency < old_to_currency THEN
            UPDATE account 
            SET total_amount = total_amount - (ABS(OLD.transaction_amount) / conv_rate)
            WHERE account_id = OLD.to_account_id;
        ELSE
            UPDATE account 
            SET total_amount = total_amount - (ABS(OLD.transaction_amount) * conv_rate)
            WHERE account_id = OLD.to_account_id;
        END IF;
    ELSE
        -- Reverse old income/expense
        IF OLD.transaction_type_id = 1 THEN -- Income
            UPDATE account 
            SET total_amount = total_amount - ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        ELSE -- Expense
            UPDATE account 
            SET total_amount = total_amount + ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        END IF;
    END IF;
    
    -- Apply new transaction
    IF NEW.to_account_id IS NOT NULL THEN
        -- Apply new transfer
        SELECT currency_id INTO from_currency
        FROM account WHERE account_id = NEW.from_account_id;
        SELECT currency_id INTO to_currency
        FROM account WHERE account_id = NEW.to_account_id;
        
        SET conv_rate = get_conversion_rate(NEW.user_id, from_currency, to_currency, NEW.transaction_date);
        
        UPDATE account 
        SET total_amount = total_amount - ABS(NEW.transaction_amount)
        WHERE account_id = NEW.from_account_id;
        
        IF from_currency < to_currency THEN
            UPDATE account 
            SET total_amount = total_amount + (ABS(NEW.transaction_amount) / conv_rate)
            WHERE account_id = NEW.to_account_id;
        ELSE
            UPDATE account 
            SET total_amount = total_amount + (ABS(NEW.transaction_amount) * conv_rate)
            WHERE account_id = NEW.to_account_id;
        END IF;
    ELSE
        -- Apply new income/expense
        IF NEW.transaction_type_id = 1 THEN -- Income
            UPDATE account 
            SET total_amount = total_amount + ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        ELSE -- Expense
            UPDATE account 
            SET total_amount = total_amount - ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        END IF;
    END IF;
END //

-- AFTER DELETE trigger
CREATE TRIGGER after_transaction_delete
AFTER DELETE ON `transaction`
FOR EACH ROW
BEGIN
    DECLARE from_currency, to_currency INT;
    DECLARE conv_rate DECIMAL(15,6);
    
    IF OLD.to_account_id IS NOT NULL THEN
        -- Reverse transfer
        SELECT currency_id INTO from_currency
        FROM account WHERE account_id = OLD.from_account_id;
        SELECT currency_id INTO to_currency
        FROM account WHERE account_id = OLD.to_account_id;
        
        SET conv_rate = get_conversion_rate(OLD.user_id, from_currency, to_currency, OLD.transaction_date);
        
        UPDATE account 
        SET total_amount = total_amount + ABS(OLD.transaction_amount)
        WHERE account_id = OLD.from_account_id;
        
        IF from_currency < to_currency THEN
            UPDATE account 
            SET total_amount = total_amount - (ABS(OLD.transaction_amount) / conv_rate)
            WHERE account_id = OLD.to_account_id;
        ELSE
            UPDATE account 
            SET total_amount = total_amount - (ABS(OLD.transaction_amount) * conv_rate)
            WHERE account_id = OLD.to_account_id;
        END IF;
    ELSE
        -- Reverse income/expense
        IF OLD.transaction_type_id = 1 THEN -- Income
            UPDATE account 
            SET total_amount = total_amount - ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        ELSE -- Expense
            UPDATE account 
            SET total_amount = total_amount + ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        END IF;
    END IF;
END //

DELIMITER ;