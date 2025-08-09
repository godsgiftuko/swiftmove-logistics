import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { logoutUser } = useAuth();
  return (
    <header
      style={{
        background: "#fff",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <h1 style={{ fontSize: "1.25rem" }}>Dashboard</h1>
      <button
        className="text-red-500"
        onClick={() => {
          logoutUser();
        }}
      >
        Logout
      </button>
    </header>
  );
}
