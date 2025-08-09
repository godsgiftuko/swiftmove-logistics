import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function AppRouter() {
  return (
    <Router>
     <Routes>
        <Route path="/" index element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
  </Router>
  );
}
