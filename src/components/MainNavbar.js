import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MainNavbar.css';

function MainNavbar() {
  const location = useLocation();
  const isDropdownActive = ['/settings', '/debt-calculator', '/stocks'].includes(location.pathname);

  return (
    <div className="topnav">
      <Link to="/transactions" className={location.pathname === '/transactions' ? 'active' : ''}>Transactions</Link>
      <Link to="/accounts" className={location.pathname === '/accounts' ? 'active' : ''}>Accounts</Link>
      <Link to="/stats" className={location.pathname === '/stats' ? 'active' : ''}>Stats</Link>

      <div className="dropdown">
        <a className={`dropbtn ${isDropdownActive ? 'active' : ''}`}>More</a>
        <div className="dropdown-content">
          <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>Settings</Link>
          <Link to="/debt-calculator" className={location.pathname === '/debt-calculator' ? 'active' : ''}>Debt Calculator</Link>
          <Link to="/stocks" className={location.pathname === '/stocks' ? 'active' : ''}>Stocks</Link>
        </div>
      </div>

      <Link to="#" className="logout">Log Out</Link>
    </div>
  );
}

export default MainNavbar;