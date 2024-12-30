import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainNavbar from './components/MainNavbar';
import TransactionBox from './components/TransactionBox';
import Transaction from './components/Transaction';
import Accounts from './components/Accounts';
import Stats from './components/Stats';
import Settings from './components/Settings';
import DebtCalculator from './components/DebtCalculator';
import Stocks from './components/Stocks';

function App() {

  return (
    <Router>
      <MainNavbar />
      <div className='NavbarSpacer'></div>
      <Routes>
        {/* Default landing page */}
        <Route 
          path="/" 
          element={
            <Navigate replace to="/transactions" />
          } 
        />

        <Route 
          path="/transactions" 
          element={
            <TransactionBox>
              {dummyTransactions.map((txn, idx) => (
                <Transaction
                  key={idx}
                  date={txn.date}
                  amount={txn.amount}
                  accountFrom={txn.accountFrom}
                  accountTo={txn.accountTo}
                  transactionName={txn.transactionName}
                  category={txn.category}
                  type={txn.type}
                  currency={txn.currency}
                />
              ))}
            </TransactionBox>
          } 
        />

        <Route path="/accounts" element={<Accounts />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/debt-calculator" element={<DebtCalculator />} />
        <Route path="/stocks" element={<Stocks />} />

        {/* Catch-all route */}
        <Route 
          path="*"
          element={<Navigate replace to="/transactions" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
