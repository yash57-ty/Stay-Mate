import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./pages/MenuPage";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Admin from "./pages/Admin";
import MainLayout from "./layouts/MainLayout";
import Pgform from "./pages/Pgform"
import ProtectedRoute from "./pages/ProtectedRoute";
import Pg from "./pages/Pg"
import RestaurantRegisterInfo from "./pages/RestaurantRegisterInfo";
import Showpg from "./pages/Showpg";
import ManagePg from "./pages/ManagePg";

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
            <ProtectedRoute allowedRole={["ROLE_USER","ROLE_PGOWNER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/Showpg"
        element={
          <ProtectedRoute allowedRole={["ROLE_PGOWNER","ROLE_USER","ROLE_ADMIN"]}>
            <MainLayout>
            <Showpg/>
            </MainLayout>
          </ProtectedRoute>
        }
        />
        <Route
        path="/ManagePg"
        element={
          <ProtectedRoute allowedRole="ROLE_PGOWNER">
            <MainLayout>
              <ManagePg/>
            </MainLayout> 
          </ProtectedRoute>
        }
        />

        <Route
          path="/Pgform"
          element={
            <ProtectedRoute allowedRole="ROLE_PGOWNER">
              <MainLayout>
            <Pgform/>
            </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/Admin-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {}
        <Route
        path="/pg"
        element={
          <ProtectedRoute allowedRole="ROLE_ADMIN">
            <MainLayout>
              <Pg/>
              </MainLayout>
            </ProtectedRoute>
        }
        />

        {/* Admin Analytics Page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
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
