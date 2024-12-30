import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainNavbar from './components/MainNavbar';
import Transactions from './components/Transactions';
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

        <Route path="/transactions" element={ <Transactions />} />

        <Route 
          path="/" 
          element={
            <Navigate replace to="/transactions" />
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
