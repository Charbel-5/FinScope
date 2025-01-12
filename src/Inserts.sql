BEGIN
    -- Insert into Currency Setting Type
    INSERT INTO currency_setting_type (currency_setting_type_id, currency_setting_type_de) VALUES (currency_setting_type_seq.NEXTVAL, 'Primary Currency');
    INSERT INTO currency_setting_type (currency_setting_type_id, currency_setting_type_de) VALUES (currency_setting_type_seq.NEXTVAL, 'Secondary Currency');

    -- Insert into Account Type
    INSERT INTO account_type (account_type_id, account_type_description) VALUES (account_type_seq.NEXTVAL, 'Cash');
    INSERT INTO account_type (account_type_id, account_type_description) VALUES (account_type_seq.NEXTVAL, 'Card');
    INSERT INTO account_type (account_type_id, account_type_description) VALUES (account_type_seq.NEXTVAL, 'Savings');
    INSERT INTO account_type (account_type_id, account_type_description) VALUES (account_type_seq.NEXTVAL, 'Loan');

    -- Insert into Transaction Type
    INSERT INTO transaction_type (transaction_type_id, transaction_type_description) VALUES (transaction_type_seq.NEXTVAL, 'Income');
    INSERT INTO transaction_type (transaction_type_id, transaction_type_description) VALUES (transaction_type_seq.NEXTVAL, 'Expense');
    INSERT INTO transaction_type (transaction_type_id, transaction_type_description) VALUES (transaction_type_seq.NEXTVAL, 'Transfer');

    -- Insert into Users
    INSERT INTO users (user_id, email, password, user_name) 
    VALUES (users_seq.NEXTVAL, 'system@dummy.com', 'dummyPass', 'System User');

    -- Insert into Transaction Category for Income
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Allowance', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Salary', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Petty cash', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Bonus', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1);

    -- Insert into Transaction Category for Expense
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Transport', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Food', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Groceries', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Health', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Education', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Apparel', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Household', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);
    INSERT INTO transaction_category (transaction_category_id, transaction_category_de, user_id, transaction_type_id)
    VALUES (transaction_category_seq.NEXTVAL, 'Gift', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);




     -- Insert into Currency
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'US Dollar', 'USD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Euro', 'EUR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'British Pound', 'GBP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Japanese Yen', 'JPY');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Canadian Dollar', 'CAD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Australian Dollar', 'AUD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Swiss Franc', 'CHF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Chinese Yuan', 'CNY');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Swedish Krona', 'SEK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'New Zealand Dollar', 'NZD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Afghan Afghani', 'AFN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Albanian Lek', 'ALL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Algerian Dinar', 'DZD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Angolan Kwanza', 'AOA');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Argentine Peso', 'ARS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Armenian Dram', 'AMD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Aruban Florin', 'AWG');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Azerbaijani Manat', 'AZN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bahamian Dollar', 'BSD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bahraini Dinar', 'BHD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bangladeshi Taka', 'BDT');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Barbadian Dollar', 'BBD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Belarusian Ruble', 'BYN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Belize Dollar', 'BZD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bermudian Dollar', 'BMD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bhutanese Ngultrum', 'BTN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bolivian Boliviano', 'BOB');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bosnia and Herzegovina Convertible Mark', 'BAM');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Botswana Pula', 'BWP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Brazilian Real', 'BRL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Brunei Dollar', 'BND');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Bulgarian Lev', 'BGN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Burundi Franc', 'BIF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Cabo Verdean Escudo', 'CVE');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Cambodian Riel', 'KHR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Central African CFA Franc', 'XAF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'CFP Franc', 'XPF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Chilean Peso', 'CLP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Colombian Peso', 'COP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Comorian Franc', 'KMF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Congolese Franc', 'CDF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Costa Rican Colón', 'CRC');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Croatian Kuna', 'HRK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Cuban Peso', 'CUP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Czech Koruna', 'CZK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Danish Krone', 'DKK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Djiboutian Franc', 'DJF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Dominican Peso', 'DOP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'East Caribbean Dollar', 'XCD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Egyptian Pound', 'EGP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Eritrean Nakfa', 'ERN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Ethiopian Birr', 'ETB');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Falkland Islands Pound', 'FKP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Fijian Dollar', 'FJD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Gambian Dalasi', 'GMD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Georgian Lari', 'GEL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Ghanaian Cedi', 'GHS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Gibraltar Pound', 'GIP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Guatemalan Quetzal', 'GTQ');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Guinean Franc', 'GNF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Guyanese Dollar', 'GYD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Haitian Gourde', 'HTG');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Honduran Lempira', 'HNL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Hong Kong Dollar', 'HKD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Hungarian Forint', 'HUF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Icelandic Króna', 'ISK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Indian Rupee', 'INR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Indonesian Rupiah', 'IDR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Iranian Rial', 'IRR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Iraqi Dinar', 'IQD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Israeli New Shekel', 'ILS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Jamaican Dollar', 'JMD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Jordanian Dinar', 'JOD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Kazakhstani Tenge', 'KZT');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Kenyan Shilling', 'KES');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Kuwaiti Dinar', 'KWD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Kyrgyzstani Som', 'KGS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Lao Kip', 'LAK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Lebanese Pound', 'LBP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Lesotho Loti', 'LSL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Liberian Dollar', 'LRD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Libyan Dinar', 'LYD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Macanese Pataca', 'MOP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Macedonian Denar', 'MKD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Malagasy Ariary', 'MGA');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Malawian Kwacha', 'MWK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Malaysian Ringgit', 'MYR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Maldivian Rufiyaa', 'MVR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Mauritanian Ouguiya', 'MRU');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Mauritian Rupee', 'MUR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Mexican Peso', 'MXN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Moldovan Leu', 'MDL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Mongolian Tögrög', 'MNT');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Moroccan Dirham', 'MAD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Mozambican Metical', 'MZN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Myanmar Kyat', 'MMK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Namibian Dollar', 'NAD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Nepalese Rupee', 'NPR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Nicaraguan Córdoba', 'NIO');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Nigerian Naira', 'NGN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'North Korean Won', 'KPW');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Norwegian Krone', 'NOK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Omani Rial', 'OMR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Pakistani Rupee', 'PKR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Panamanian Balboa', 'PAB');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Papua New Guinean Kina', 'PGK');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Paraguayan Guaraní', 'PYG');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Peruvian Sol', 'PEN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Philippine Peso', 'PHP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Polish Złoty', 'PLN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Qatari Riyal', 'QAR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Romanian Leu', 'RON');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Russian Ruble', 'RUB');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Rwandan Franc', 'RWF');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Saint Helena Pound', 'SHP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Samoan Tālā', 'WST');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'São Tomé and Príncipe Dobra', 'STN');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Saudi Riyal', 'SAR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Serbian Dinar', 'RSD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Seychellois Rupee', 'SCR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Sierra Leonean Leone', 'SLL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Singapore Dollar', 'SGD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Solomon Islands Dollar', 'SBD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Somali Shilling', 'SOS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'South African Rand', 'ZAR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'South Korean Won', 'KRW');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'South Sudanese Pound', 'SSP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Sri Lankan Rupee', 'LKR');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Sudanese Pound', 'SDG');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Surinamese Dollar', 'SRD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Swazi Lilangeni', 'SZL');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Syrian Pound', 'SYP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Taiwan Dollar', 'TWD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Tajikistani Somoni', 'TJS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Tanzanian Shilling', 'TZS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Thai Baht', 'THB');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Tongan Paʻanga', 'TOP');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Trinidad and Tobago Dollar', 'TTD');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Tunisian Dinar', 'TND');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Turkish Lira', 'TRY');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Turkmenistani Manat', 'TMT');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Ugandan Shilling', 'UGX');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Ukrainian Hryvnia', 'UAH');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'United Arab Emirates Dirham', 'AED');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Uruguayan Peso', 'UYU');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Uzbekistani Soʻm', 'UZS');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Vanuatu Vatu', 'VUV');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Venezuelan Bolívar Soberano', 'VES');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Vietnamese Đồng', 'VND');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Yemeni Rial', 'YER');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Zambian Kwacha', 'ZMW');
    INSERT INTO currency (currency_id, currency_name, symbol) VALUES (currency_seq.NEXTVAL, 'Zimbabwean Dollar', 'ZWL');

    COMMIT;
END;
/