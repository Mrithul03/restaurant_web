import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import ClientApp from './pages/ClientApp'
import AdminApp from './pages/AdminApp'
import AdminLogin from './pages/AdminLogin'
import Staff from './pages/Staff'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  return token ? children : <Navigate to="/admin/login" replace />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Default → go to login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Public route */}
        <Route path="/client" element={<ClientApp />} />

        {/* Protected admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminApp />
            </ProtectedRoute>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff/>
            </ProtectedRoute>
          }
        />

        {/* Login route */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
