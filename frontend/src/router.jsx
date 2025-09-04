import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Auth & Admin Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Register from "./pages/auth/Register";
import OrderDisplay from "./pages/customer/MyOrders";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminFooterManagement from "./pages/admin/AdminFooterManagement";
import AdminHeaderManagement from "./pages/admin/AdminHeaderManagement";
import AdminOfferManagement from "./pages/admin/AdminOfferManagement";
import Invoice from "./pages/admin/Invoice";

// Guards
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RoleGuard = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem("role");
  return allowedRoles.includes(userRole) ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

// Admin Layout + Routes
const AdminRoutes = () => (
  <RoleGuard allowedRoles={["admin"]}>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </RoleGuard>
);

// (Future) Customer Layout + Routes (placeholder only)
const CustomerRoutes = () => (
  <RoleGuard allowedRoles={["user", "customer"]}>
    <CustomerLayout>
      <Outlet />
    </CustomerLayout>
  </RoleGuard>
);

// Role-based redirect
const getDashboardPath = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  if (!token) return "/login";

  switch (role) {
    case "admin":
      return "/admin";
    case "customer":
      return "/";
    default:
      return "/login";
  }
};

const AppRouter = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="categories" element={<AdminCategoryManagement />} />
          <Route path="product" element={<AdminProductManagement />} />
          <Route path="footer" element={<AdminFooterManagement />} />
          <Route path="header" element={<AdminHeaderManagement />} />
          <Route path="offer" element={<AdminOfferManagement />} />
          <Route path="invoice" element={<Invoice />} />

          {/* Add more admin routes like category, product here */}
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CustomerRoutes />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="my-orders" element={<OrderDisplay />} />
        </Route>

        {/* Catch-All */}
        <Route
          path="*"
          element={<Navigate to={getDashboardPath()} replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
