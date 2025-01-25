import React, { useState } from 'react';
import { AuthModal } from '../components/AuthModal';
import Login from './Login';
import Signup from './Signup';
import './LandingPage.css';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuVisible(!isMobileMenuVisible);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <div 
              className="navbar__brand" 
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-primary-dark)',
                letterSpacing: '1px'
              }}
            >
              FinScope
            </div>
          </div>
          {/* Regular buttons for desktop */}
          <div className="navbar__actions">
            <button className="btn--signup" onClick={() => setShowLogin(true)}>Login</button>
            <button className="btn--signup" onClick={() => setShowSignup(true)}>Sign Up</button>
          </div>
          {/* Burger menu for mobile */}
          <div 
            className="navbar__burger" 
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div 
              className="navbar__burger-line" 
              style={{
                width: '25px',
                height: '3px',
                background: 'var(--color-text)'
              }}
            />
            <div 
              className="navbar__burger-line"
              style={{
                width: '25px',
                height: '3px', 
                background: 'var(--color-text)'
              }}
            />
            <div 
              className="navbar__burger-line"
              style={{
                width: '25px',
                height: '3px',
                background: 'var(--color-text)'
              }}
            />
          </div>
        </div>
        {/* Mobile menu items */}
        <div className={`navbar__items ${isMobileMenuVisible ? 'visible' : ''}`}>
          <button className="btn--signup" onClick={() => setShowLogin(true)}>Login</button>
          <button className="btn--signup" onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
      </nav>
      
      {/* Rest of your landing page content */}

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Welcome to FinScope</h1>
          <p className="hero__subtitle">
            Emphasizing clarity and oversight in financial management.
          </p>
          <button className="hero__btn" onClick={() => setShowSignup(true)}>
            Get Started
          </button>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="section">
        <div className="section__container">
          <h2 className="section__title">Experience Next-Gen Finance</h2>
          <p className="section__subtitle" style={{maxWidth: '800px', margin: '0 auto', lineHeight: '1.6'}}>
            Join thousands of users who have transformed their financial management with FinScope. 
            Our platform combines cutting-edge technology with intuitive design to give you 
            complete control over your financial universe - from daily transactions to long-term investments.
          </p>
        </div>
      </section>

      <br></br>

      {/* EXAMPLE GRID ROW 1 */}
      <div className="grid-row">
        <div className="grid-col">
          <h2>Smart Financial Management</h2>
          <p>
            Track your income and expenses effortlessly with dual currency support. 
            Monitor transactions across multiple accounts while seeing all balances 
            converted to your primary currency.
          </p>
          <div className="image-box" style={{backgroundColor: 'var(--color-hover)'}}>
            <img src="/images/Transactions.png" alt="Transactions Page" />
          </div>
        </div>
        <div className="grid-col">
          <h2>Comprehensive Account Control</h2>
          <p>
            Manage all your financial accounts in one place - from cash and savings 
            to investments and loans. Track balances, monitor transactions, and transfer 
            funds seamlessly.
          </p>
          <div className="image-box" style={{backgroundColor: 'var(--color-hover)'}}>
            <img src="/images/Accounts.png" alt="Transactions Page" />
          </div>
        </div>
      </div>

      {/* EXAMPLE GRID ROW 2 */}
      <div className="grid-row">
        <div className="grid-col">
          <h2>Visual Financial Insights</h2>
          <p>
            Transform your financial data into clear visual insights. Track spending 
            patterns, analyze income sources, and understand your financial health 
            through interactive charts and graphs.
          </p>
          <div className="image-box" style={{backgroundColor: 'var(--color-hover)'}}>
            <img src="/images/Statistics.png" alt="Transactions Page" />
          </div>
        </div>
        <div className="grid-col">
          <h2>Investment Portfolio Tracking</h2>
          <p>
            Keep track of your stock investments in real-time. Monitor your portfolio's 
            performance, track individual stocks, and make informed investment decisions.
          </p>
          <div className="image-box" style={{backgroundColor: 'var(--color-hover)'}}>
            <img src="/images/Investments.png" alt="Transactions Page" />
          </div>
        </div>
      </div>

      {/* EXAMPLE GRID ROW 3 */}
      <div className="grid-row">
        <div className="grid-col">
          <h2>Debt Management Tools</h2>
          <p>
            Take control of your debts with our powerful calculator. Compare different 
            repayment strategies, track your progress, and find the fastest path to 
            becoming debt-free.
          </p>
          <div className="image-box" style={{backgroundColor: 'var(--color-hover)'}}>
            <img src="/images/Debt_Tracking.png" alt="Transactions Page" />
          </div>
        </div>
        <div className="grid-col">
          <h2>Secure & Accessible</h2>
          <p>
            Your financial data's security is our priority. Access your accounts securely from 
            anywhere while enjoying peace of mind with robust authentication and private 
            account management.
          </p>
          <div className="image-box" style={{backgroundColor: 'var(--color-hover)'}}>
            <img src="/images/Secure.png" alt="Transactions Page" />
          </div>
        </div>
      </div>

      {/* WHY CHOOSE FINSCOPE? */}
      <section className="section">
        <div className="section__container">
          <h2 className="section__title">Why Choose FinScope?</h2>
          <p className="section__subtitle">
            Your all-in-one solution for modern financial management
          </p>
          <ul style={{listStyle: 'none', textAlign: 'center', marginBottom: '2rem'}}>
            <li>✓ Comprehensive financial tracking and management</li>
            <li>✓ Multi-currency support with automatic conversion</li>
            <li>✓ Real-time stock portfolio monitoring</li>
            <li>✓ Advanced debt management tools</li>
            <li>✓ Intuitive and user-friendly interface</li>
          </ul>
        </div>
      </section>

      <div>
        <br></br>
      </div>

      {/* Features Section (existing) */}
      <section className="section">
        <div className="section__container">
          <h2 className="section__title">Your Finance, Simplified</h2>
          <p className="section__subtitle">"Emphasizing clarity and oversight in financial management"</p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="button button--primary"
              onClick={() => setShowSignup(true)}
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid (existing) */}
      <div className="grid-row">
        {/* ... Keep existing grid content ... */}
      </div>

 

      {showLogin && (
        <AuthModal onClose={() => setShowLogin(false)}>
          <Login onSuccess={() => setShowLogin(false)} />
        </AuthModal>
      )}
      {showSignup && (
        <AuthModal onClose={() => setShowSignup(false)}>
          <Signup onSuccess={() => setShowSignup(false)} />
        </AuthModal>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2025 FinScope. All rights reserved.</p>
      </footer>
    </>
  );
}

export default LandingPage;