-- Start a transaction (optional but recommended)

START TRANSACTION;
 
-- 1) Insert into ACCOUNT_TYPE


INSERT INTO currency (currency_name, symbol)

VALUES

    ('US Dollar', 'USD'),

    ('Lebanese Pound', 'LBP'),


    ('Euro', 'EUR'),

    ('British Pound', 'GBP'),

    ('Japanese Yen', 'JPY'),

    ('Canadian Dollar', 'CAD'),

    ('Australian Dollar', 'AUD'),

    ('Swiss Franc', 'CHF'),

    ('Chinese Yuan', 'CNY'),

    ('Swedish Krona', 'SEK'),

    ('New Zealand Dollar', 'NZD'),

    ('Afghan Afghani', 'AFN'),

    ('Albanian Lek', 'ALL'),

    ('Algerian Dinar', 'DZD'),

    ('Angolan Kwanza', 'AOA'),

    ('Argentine Peso', 'ARS'),

    ('Armenian Dram', 'AMD'),

    ('Aruban Florin', 'AWG'),

    ('Azerbaijani Manat', 'AZN'),

    ('Bahamian Dollar', 'BSD'),

    ('Bahraini Dinar', 'BHD'),

    ('Bangladeshi Taka', 'BDT'),

    ('Barbadian Dollar', 'BBD'),

    ('Belarusian Ruble', 'BYN'),

    ('Belize Dollar', 'BZD'),

    ('Bermudian Dollar', 'BMD'),

    ('Bhutanese Ngultrum', 'BTN'),

    ('Bolivian Boliviano', 'BOB'),

    ('Bosnia and Herzegovina Convertible Mark', 'BAM'),

    ('Botswana Pula', 'BWP'),

    ('Brazilian Real', 'BRL'),

    ('Brunei Dollar', 'BND'),

    ('Bulgarian Lev', 'BGN'),

    ('Burundi Franc', 'BIF'),

    ('Cabo Verdean Escudo', 'CVE'),

    ('Cambodian Riel', 'KHR'),

    ('Central African CFA Franc', 'XAF'),

    ('CFP Franc', 'XPF'),

    ('Chilean Peso', 'CLP'),

    ('Colombian Peso', 'COP'),

    ('Comorian Franc', 'KMF'),

    ('Congolese Franc', 'CDF'),

    ('Costa Rican Colón', 'CRC'),

    ('Croatian Kuna', 'HRK'),

    ('Cuban Peso', 'CUP'),

    ('Czech Koruna', 'CZK'),

    ('Danish Krone', 'DKK'),

    ('Djiboutian Franc', 'DJF'),

    ('Dominican Peso', 'DOP'),

    ('East Caribbean Dollar', 'XCD'),

    ('Egyptian Pound', 'EGP'),

    ('Eritrean Nakfa', 'ERN'),

    ('Ethiopian Birr', 'ETB'),

    ('Falkland Islands Pound', 'FKP'),

    ('Fijian Dollar', 'FJD'),

    ('Gambian Dalasi', 'GMD'),

    ('Georgian Lari', 'GEL'),

    ('Ghanaian Cedi', 'GHS'),

    ('Gibraltar Pound', 'GIP'),

    ('Guatemalan Quetzal', 'GTQ'),

    ('Guinean Franc', 'GNF'),

    ('Guyanese Dollar', 'GYD'),

    ('Haitian Gourde', 'HTG'),

    ('Honduran Lempira', 'HNL'),

    ('Hong Kong Dollar', 'HKD'),

    ('Hungarian Forint', 'HUF'),

    ('Icelandic Króna', 'ISK'),

    ('Indian Rupee', 'INR'),

    ('Indonesian Rupiah', 'IDR'),

    ('Iranian Rial', 'IRR'),

    ('Iraqi Dinar', 'IQD'),

    ('Israeli New Shekel', 'ILS'),

    ('Jamaican Dollar', 'JMD'),

    ('Jordanian Dinar', 'JOD'),

    ('Kazakhstani Tenge', 'KZT'),

    ('Kenyan Shilling', 'KES'),

    ('Kuwaiti Dinar', 'KWD'),

    ('Kyrgyzstani Som', 'KGS'),

    ('Lao Kip', 'LAK'),

    ('Lesotho Loti', 'LSL'),

    ('Liberian Dollar', 'LRD'),

    ('Libyan Dinar', 'LYD'),

    ('Macanese Pataca', 'MOP'),

    ('Macedonian Denar', 'MKD'),

    ('Malagasy Ariary', 'MGA'),

    ('Malawian Kwacha', 'MWK'),

    ('Malaysian Ringgit', 'MYR'),

    ('Maldivian Rufiyaa', 'MVR'),

    ('Mauritanian Ouguiya', 'MRU'),

    ('Mauritian Rupee', 'MUR'),

    ('Mexican Peso', 'MXN'),

    ('Moldovan Leu', 'MDL'),

    ('Mongolian Tögrög', 'MNT'),

    ('Moroccan Dirham', 'MAD'),

    ('Mozambican Metical', 'MZN'),

    ('Myanmar Kyat', 'MMK'),

    ('Namibian Dollar', 'NAD'),

    ('Nepalese Rupee', 'NPR'),

    ('Nicaraguan Córdoba', 'NIO'),

    ('Nigerian Naira', 'NGN'),

    ('North Korean Won', 'KPW'),

    ('Norwegian Krone', 'NOK'),

    ('Omani Rial', 'OMR'),

    ('Pakistani Rupee', 'PKR'),

    ('Panamanian Balboa', 'PAB'),

    ('Papua New Guinean Kina', 'PGK'),

    ('Paraguayan Guaraní', 'PYG'),

    ('Peruvian Sol', 'PEN'),

    ('Philippine Peso', 'PHP'),

    ('Polish Złoty', 'PLN'),

    ('Qatari Riyal', 'QAR'),

    ('Romanian Leu', 'RON'),

    ('Russian Ruble', 'RUB'),

    ('Rwandan Franc', 'RWF'),

    ('Saint Helena Pound', 'SHP'),

    ('Samoan Tālā', 'WST'),

    ('São Tomé and Príncipe Dobra', 'STN'),

    ('Saudi Riyal', 'SAR'),

    ('Serbian Dinar', 'RSD'),

    ('Seychellois Rupee', 'SCR'),

    ('Sierra Leonean Leone', 'SLL'),

    ('Singapore Dollar', 'SGD'),

    ('Solomon Islands Dollar', 'SBD'),

    ('Somali Shilling', 'SOS'),

    ('South African Rand', 'ZAR'),

    ('South Korean Won', 'KRW'),

    ('South Sudanese Pound', 'SSP'),

    ('Sri Lankan Rupee', 'LKR'),

    ('Sudanese Pound', 'SDG'),

    ('Surinamese Dollar', 'SRD'),

    ('Swazi Lilangeni', 'SZL'),

    ('Syrian Pound', 'SYP'),

    ('Taiwan Dollar', 'TWD'),

    ('Tajikistani Somoni', 'TJS'),

    ('Tanzanian Shilling', 'TZS'),

    ('Thai Baht', 'THB'),

    ('Tongan Paanga', 'TOP'),

    ('Trinidad and Tobago Dollar', 'TTD'),

    ('Tunisian Dinar', 'TND'),

    ('Turkish Lira', 'TRY'),

    ('Turkmenistani Manat', 'TMT'),

    ('Ugandan Shilling', 'UGX'),

    ('Ukrainian Hryvnia', 'UAH'),

    ('United Arab Emirates Dirham', 'AED'),

    ('Uruguayan Peso', 'UYU'),

    ('Uzbekistani Som', 'UZS'),

    ('Vanuatu Vatu', 'VUV'),

    ('Venezuelan Bolívar Soberano', 'VES'),

    ('Vietnamese Đồng', 'VND'),

    ('Yemeni Rial', 'YER'),

    ('Zambian Kwacha', 'ZMW'),

    ('Zimbabwean Dollar', 'ZWL');
 
-- Commit the entire batch of inserts

-- 3) Insert into USERS

INSERT INTO account_type (account_type_description)

VALUES

    ('Cash'),

    ('Card'),

    ('Savings'),

    ('Loan');
 
-- 2) Insert into TRANSACTION_TYPE

INSERT INTO transaction_type (transaction_type_description)

VALUES

    ('Income'),

    ('Expense'),

    ('Transfer');
 

 
-- 4) Insert into TRANSACTION_CATEGORY

--    Use a subquery to find the user_id for 'system@dummy.com'

--    and hardcode the transaction_type_id values:

INSERT INTO users (email, password, user_name, primary_currency_id, secondary_currency_id)

VALUES

    ('system@dummy.com', 'dummyPass', 'System User', 1, 2);

INSERT INTO transaction_category (

    transaction_category_de,

    user_id,

    transaction_type_id

)



VALUES

    -- Income categories (transaction_type_id = 1)

    ('Allowance',  (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1),

    ('Salary',     (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1),

    ('Petty cash', (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1),

    ('Bonus',      (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 1),
 
    -- Expense categories (transaction_type_id = 2)

    ('Transport',  (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Food',       (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Groceries',  (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Health',     (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Education',  (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Apparel',    (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Household',  (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2),

    ('Gift',       (SELECT user_id FROM users WHERE email = 'system@dummy.com'), 2);


 
-- 5) Insert into CURRENCY





COMMIT;

 