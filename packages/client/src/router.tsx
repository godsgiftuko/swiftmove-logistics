import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

export default function AppRouter() {
  return (
    <Router>
     <Routes>
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
        <Route path="/dashboard" element={
          <ProtectedRoute>
              <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
  </Router>
  );
}
