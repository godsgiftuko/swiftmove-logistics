import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function DashboardLayout() {
  return (
    <div className="dashboard-container" style={{ display: "flex", height: "100vh" }}>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "1rem", background: "#f5f6fa" }}>
          {/* Render the nested route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
