import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { ClientPortal } from './pages/dashboard/ClientPortal';
import { Clients } from './pages/dashboard/Clients';
import { Trusts } from './pages/dashboard/Trusts';
import { Documents } from './pages/dashboard/Documents';
import { Settings } from './pages/dashboard/Settings';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const DashboardRouter = () => {
  const { role } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={role === 'Client' ? <ClientPortal /> : <DashboardOverview />} />
      <Route path="clients" element={<Clients />} />
      <Route path="trusts" element={<Trusts />} />
      <Route path="documents" element={<Documents />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
