import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainNavbar from './components/MainNavbar';
import LandingPage from './pages/LandingPage';



import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import DebtCalculator from './pages/DebtCalculator';
import Stocks from './pages/Stocks';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/transactions" />;
}

function AppContent() {

  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && (
        <>
          <MainNavbar />
          <div className="NavbarSpacer"></div>
        </>
      )}
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
          } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } />
        <Route
          path="/accounts"
          element={
            <PrivateRoute>
              <Accounts />
            </PrivateRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <Stats />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/debt-calculator"
          element={
            <PrivateRoute>
              <DebtCalculator />
            </PrivateRoute>
          }
        />
        <Route
          path="/stocks"
          element={
            <PrivateRoute>
              <Stocks />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


function App() {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
}

export default App;