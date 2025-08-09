import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Router>
     <Routes>
        <Route path="/" index element={<AuthPage />} />
        <Route path="/admin" index element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
              <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
  </Router>
  );
}
