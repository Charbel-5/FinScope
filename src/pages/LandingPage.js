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

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <div className="navbar__brand">FinScope</div>
            <div className="navbar__search">
              <input type="text" placeholder="Search..." />
              <span className="navbar__search__icon">&#128269;</span>
            </div>
          </div>
          <div className="navbar__actions">
            <button className="navbar__link" onClick={() => setShowLogin(true)}>Login</button>
            <button className="btn--signup" onClick={() => setShowSignup(true)}>Sign Up</button>
          </div>
          <div className="navbar__burger" onClick={toggleMobileMenu}>
            <div className="navbar__burger-line"></div>
            <div className="navbar__burger-line"></div>
            <div className="navbar__burger-line"></div>
          </div>
        </div>
        <div className={`navbar__items ${isMobileMenuVisible ? 'visible' : ''}`}>
          <button className="navbar__link" onClick={() => setShowLogin(true)}>Login</button>
          <button className="btn--signup" onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
      </nav>

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
          <h2 className="section__title">Welcome Section</h2>
          <p className="section__subtitle">
            (Place any additional welcome text here.)
          </p>
        </div>
      </section>

      {/* EXAMPLE GRID ROW 1 */}
      <div className="grid-row">
        <div className="grid-col">
          <h2>Grid Item 1</h2>
          <p>Content goes here.</p>
        </div>
        <div className="grid-col">
          <h2>Grid Item 2</h2>
          <p>Content goes here.</p>
        </div>
      </div>

      {/* EXAMPLE GRID ROW 2 */}
      <div className="grid-row">
        <div className="grid-col">
          <h2>Grid Item 3</h2>
          <p>Content goes here.</p>
        </div>
        <div className="grid-col">
          <h2>Grid Item 4</h2>
          <p>Content goes here.</p>
        </div>
      </div>

      {/* EXAMPLE GRID ROW 3 */}
      <div className="grid-row">
        <div className="grid-col">
          <h2>Grid Item 5</h2>
          <p>Content goes here.</p>
        </div>
        <div className="grid-col">
          <h2>Grid Item 6</h2>
          <p>Content goes here.</p>
        </div>
      </div>

      {/* WHY CHOOSE FINSCOPE? */}
      <section className="section">
        <div className="section__container">
          <h2 className="section__title">Why Choose FinScope?</h2>
          <p className="section__subtitle">
            (Explain the benefits or unique features here.)
          </p>
        </div>
      </section>

      {/* Features Section (existing) */}
      <section className="section">
        <div className="section__container">
          <h2 className="section__title">Your Finance, Simplified</h2>
          <p className="section__subtitle">"Emphasizing clarity and oversight in financial management"</p>
        </div>
      </section>

      {/* Feature Grid (existing) */}
      <div className="grid-row">
        {/* ... Keep existing grid content ... */}
      </div>

      {/* FINAL CTA */}
      <section className="section">
        <div className="section__container">
          <h2 className="section__title">Get Started Today</h2>
          <p className="section__subtitle">
            (Encourage users to sign up or take an action.)
          </p>
          <button className="btn--signup" onClick={() => setShowSignup(true)}>
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Auth Modals */}
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