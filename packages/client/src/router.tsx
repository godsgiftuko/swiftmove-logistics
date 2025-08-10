import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ShipmentPage from "./pages/ShipmentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { RequireRole } from "./components/RequireRole";

export default function AppRouter() {
  return (
    <Router>
     <Routes>
        {/* Auth routes */}
        <Route path="/" index element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        } />
        <Route path="/admin" index element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        } />

        {/* Dashboard routes */}
         <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
         }>
          <Route index element={<DashboardPage />} />
          <Route path="shipping" element={
            <RequireRole allowedRoles={['admin', 'manager']}>
              <ShipmentPage />
            </RequireRole>
          } />
        </Route>

      </Routes>
  </Router>
  );
}
