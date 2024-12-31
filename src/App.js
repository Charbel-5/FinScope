import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainNavbar from './components/MainNavbar';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import DebtCalculator from './pages/DebtCalculator';
import Stocks from './pages/Stocks';

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
