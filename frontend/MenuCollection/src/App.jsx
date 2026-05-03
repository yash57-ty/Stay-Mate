import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./pages/MenuPage";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Admin from "./pages/Admin";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./pages/ProtectedRoute";
import RestaurantRegisterInfo from "./pages/RestaurantRegisterInfo";

const isLoggedIn = () =>
  localStorage.getItem("isLoggedIn") === "true";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path = "/restaurant-register"
          element = {<RestaurantRegisterInfo />} 
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="User">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/Admin-dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Analytics Page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <MainLayout>
              <Admin />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Shared Layout Pages */}
        <Route
          path="/menus"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MenuPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Orders />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
