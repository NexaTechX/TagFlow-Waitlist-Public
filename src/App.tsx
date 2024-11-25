import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const LandingPage = lazy(() => import('./components/LandingPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}