import { Link } from 'react-router-dom';
import './MainNavbar.css';

function MainNavbar() {
  return (
    <div className="topnav">
      <Link to="/transactions" className="active">Transactions</Link>
      <Link to="/accounts">Accounts</Link>
      <Link to="/stats">Stats</Link>

      <div className="dropdown">
        <button className="dropbtn">More</button>
        <div className="dropdown-content">
          <Link to="/settings">Settings</Link>
          <Link to="/debt-calculator">Debt Calculator</Link>
          <Link to="/stocks">Stocks</Link>
        </div>
      </div>

      <Link to="#" className="logout">Log Out</Link>
    </div>
  );
}

export default MainNavbar;