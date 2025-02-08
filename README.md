# FinScope 🏦

A comprehensive financial management application that helps users track accounts, transactions, investments, debt and analyze their financial data, built with React.

## Features ✨

- **Account Management 💳**
  - Create and manage multiple accounts
  - Support for various account types
  - Monitor balances and transactions
  - View detailed account transaction history
  - Track accoung balances

- **Multi-Currency Support 🌐**
  - Set primary and secondary currencies
  - Currency conversion
  - Support for 100+ global currencies
  - Automatic balance conversion

- **Transaction Tracking 📊** 
  - Record income and expenses
  - Categorize transactions
  - Transfer between accounts
  - Detailed transaction history
  - Export transaction data

- **Financial Analytics 💹**
  - Monthly income/expense overview
  - Category-wise spending analysis  
  - Interactive charts and graphs
  - Balance trend tracking

- **Investment Portfolio 📈**
  - Stock portfolio tracking
  - Real-time end-of-day price updates

- **Debt Calculator 💵**
  - Loan repayment planning
  - Interest calculations
  - Compare repayment strategies

## Tech Stack 🛠️

- Frontend: React.js with Context API
- Backend: Express.js
- Database: MySQL 
- Charts: Recharts
- Styling: CSS3 with CSS Variables
- Authentication: JWT
- Other tools: Axios, Validator

## Getting Started 🚀

### Prerequisites

- Node.js (v12+)
- MySQL
- npm/yarn

## Installation

Clone repository:
```bash
git clone <repo-url>
cd finscope
```

## Dependencies Installation 📦

### Frontend Dependencies
```bash
npm install react react-dom react-router-dom @polygon.io/client-js axios react-chartjs-2 recharts validator
```

### Backend Dependencies
```bash
npm install express mysql2 cors jsonwebtoken bcrypt body-parser
```

### Database Setup 🗄️

### Create database and tables:
```bash
mysql -u your_username -p < src/database/FINSCOPE_DATABASE.sql
```

### Insert initial data:
```bash
mysql -u your_username -p < src/database/FINSCOPE_INSERTS.sql
```

### Setup triggers:
```bash
mysql -u your_username -p < src/database/Trigger.sql
```

## Configuration ⚙️

1. Modify `src/Config.js`:
```javascript
const config = {
  apiBaseUrl: 'http://localhost:3000',
  polygonApiKey: 'YOUR_POLYGON_API_KEY', // Add your Polygon.io API key here
};
```

2. Modify `src/db.js`:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'YOUR_MYSQL_USERNAME',     // Add your MySQL username
  password: 'YOUR_MYSQL_PASSWORD', // Add your MySQL password
  database: 'finscope',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## Starting the Application 🚀

### Start the backend server:
```bash
node server.js
```

### In a new terminal, start the frontend:
```bash
npm start
```
