import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../Pages/HomePage';
import { AdminLogin } from '../Pages/AdminLogin';
import { AdminDashboard } from '../Pages/AdminDashboard';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}