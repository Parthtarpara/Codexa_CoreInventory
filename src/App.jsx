import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Interactions
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CustomCursor } from './components/cursor/CustomCursor';
import { NotificationPanel } from './components/notifications/NotificationPanel';

// Store
import { useAppStore } from './store/useAppStore';

// Public Pages
import { IntroPage } from './pages/IntroPage';
import { LandingPage } from './pages/LandingPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { OTPVerify } from './pages/auth/OTPVerify';

// App Pages
import { DashboardPage } from './pages/app/DashboardPage';
import { HomePage } from './pages/app/HomePage';
import { ProductsPage } from './pages/app/ProductsPage';
import { WarehousePage } from './pages/app/WarehousePage';
import { StockOverviewPage } from './pages/app/StockOverviewPage';
import { OperationsPage } from './pages/app/OperationsPage';
import { LedgerPage } from './pages/app/LedgerPage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';
import { SettingsPage } from './pages/app/SettingsPage';

// App Layout Wrapper
const AppLayout = () => {
  return (
    <div className="flex h-screen w-full bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-primary">
          <Outlet />
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
};

// Public Route Wrapper (redirects to app if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      {/* Global Interactions */}
      <CustomCursor />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><IntroPage /></PublicRoute>} />
        <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="verify" element={<PublicRoute><OTPVerify /></PublicRoute>} />
        </Route>

        {/* Protected App Routes */}
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/app/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<ProductsPage />} /> {/* Categories redirect to Products for this demo */}
          <Route path="warehouses" element={<WarehousePage />} />
          <Route path="stock" element={<StockOverviewPage />} />
          <Route path="receipts" element={<OperationsPage type="receipts" />} />
          <Route path="deliveries" element={<OperationsPage type="deliveries" />} />
          <Route path="transfers" element={<OperationsPage type="transfers" />} />
          <Route path="adjustments" element={<OperationsPage type="adjustments" />} />
          <Route path="ledger" element={<LedgerPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
