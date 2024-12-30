import './MainNavbar.css';

function MainNavbar() {
  return (
    <div className="topnav">
        <a className="active">Transactions</a>
        <a>Accounts</a>
        <a>Stats</a>

        <div className="dropdown">
            <a className="dropbtn">More</a>
            <div className="dropdown-content">
                <a>Settings</a>
                <a>Debt Calculator</a>
                <a>Stocks</a>
            </div>
        </div>

        <a className="logout">Log Out</a>
    </div>
  );
}

export default MainNavbar;