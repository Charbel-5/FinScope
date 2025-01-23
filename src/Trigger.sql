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
    DECLARE from_currency INT;
    DECLARE to_currency INT;
    DECLARE conv_rate DECIMAL(15,6);
    
    -- Get currencies for accounts
    SELECT currency_id INTO from_currency
    FROM account WHERE account_id = NEW.from_account_id;
    
    -- For income/expense
    IF NEW.transaction_type_id IN (1,2) THEN -- Assuming 1=income, 2=expense
        IF NEW.transaction_type_id = 1 THEN -- Income
            UPDATE account 
            SET total_amount = total_amount + ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        ELSE -- Expense
            UPDATE account 
            SET total_amount = total_amount - ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        END IF;
    
    -- For transfers
    ELSE 
        -- Get target account currency
        IF NEW.to_account_id IS NOT NULL THEN
            SELECT currency_id INTO to_currency
            FROM account WHERE account_id = NEW.to_account_id;
            
            -- Pass transaction_date to get_conversion_rate
            SET conv_rate = get_conversion_rate(
                NEW.user_id, 
                from_currency, 
                to_currency, 
                NEW.transaction_date
            );
            
            -- Update source account
            UPDATE account 
            SET total_amount = total_amount - ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
            
            -- Update target account with converted amount
            UPDATE account 
            SET total_amount = total_amount + (ABS(NEW.transaction_amount) * conv_rate)
            WHERE account_id = NEW.to_account_id;
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
    
    -- Reverse old transaction first
    IF OLD.transaction_type_id IN (1,2) THEN
        IF OLD.transaction_type_id = 1 THEN
            UPDATE account 
            SET total_amount = total_amount - ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        ELSE
            UPDATE account 
            SET total_amount = total_amount + ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        END IF;
    ELSE
        IF OLD.to_account_id IS NOT NULL THEN
            SELECT currency_id INTO old_from_currency
            FROM account WHERE account_id = OLD.from_account_id;
            SELECT currency_id INTO old_to_currency
            FROM account WHERE account_id = OLD.to_account_id;
            
            SET conv_rate = get_conversion_rate(OLD.user_id, old_from_currency, old_to_currency);
            
            UPDATE account 
            SET total_amount = total_amount + ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
            
            UPDATE account 
            SET total_amount = total_amount - (ABS(OLD.transaction_amount) * conv_rate)
            WHERE account_id = OLD.to_account_id;
        END IF;
    END IF;
    
    -- Apply new transaction (similar to INSERT trigger)
    SELECT currency_id INTO from_currency
    FROM account WHERE account_id = NEW.from_account_id;
    
    IF NEW.transaction_type_id IN (1,2) THEN
        IF NEW.transaction_type_id = 1 THEN
            UPDATE account 
            SET total_amount = total_amount + ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        ELSE
            UPDATE account 
            SET total_amount = total_amount - ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
        END IF;
    ELSE
        IF NEW.to_account_id IS NOT NULL THEN
            SELECT currency_id INTO to_currency
            FROM account WHERE account_id = NEW.to_account_id;
            
            SET conv_rate = get_conversion_rate(NEW.user_id, from_currency, to_currency);
            
            UPDATE account 
            SET total_amount = total_amount - ABS(NEW.transaction_amount)
            WHERE account_id = NEW.from_account_id;
            
            UPDATE account 
            SET total_amount = total_amount + (ABS(NEW.transaction_amount) * conv_rate)
            WHERE account_id = NEW.to_account_id;
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
    
    -- Reverse the transaction
    IF OLD.transaction_type_id IN (1,2) THEN
        IF OLD.transaction_type_id = 1 THEN
            UPDATE account 
            SET total_amount = total_amount - ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        ELSE
            UPDATE account 
            SET total_amount = total_amount + ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
        END IF;
    ELSE
        IF OLD.to_account_id IS NOT NULL THEN
            SELECT currency_id INTO from_currency
            FROM account WHERE account_id = OLD.from_account_id;
            SELECT currency_id INTO to_currency
            FROM account WHERE account_id = OLD.to_account_id;
            
            SET conv_rate = get_conversion_rate(OLD.user_id, from_currency, to_currency);
            
            UPDATE account 
            SET total_amount = total_amount + ABS(OLD.transaction_amount)
            WHERE account_id = OLD.from_account_id;
            
            UPDATE account 
            SET total_amount = total_amount - (ABS(OLD.transaction_amount) * conv_rate)
            WHERE account_id = OLD.to_account_id;
        END IF;
    END IF;
END //

DELIMITER ;