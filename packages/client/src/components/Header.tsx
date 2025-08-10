import { Menu, X, Package, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logout } from "../store/authSlice";
import { useState } from "react";
// import { APP_LOGO } from "../../../shared/constants";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isDriver } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    if (onToggleSidebar) onToggleSidebar();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm border-b border-b-gray-300 px-4 py-3 flex items-center justify-between">
      {/* Left section: Menu + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={handleMenuClick}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to={"/dashboard"}>
          <h1 className="text-lg font-bold">Dashboard</h1>
        </Link>
        {/* <Link to={'/dashboard'}>
          <img
            src={APP_LOGO.TRANSPARENT}
            alt="Profile"
            className="w-10 h-10"
          />
        </Link> */}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Shipping Link */}
        {!isDriver && (
          <Link
            to="/dashboard/shipping"
            className="flex items-center gap-1 text-gray-600 hover:text-[#cf1112] transition"
          >
            <Package size={18} />
            <span className="hidden sm:inline">Shipping</span>
          </Link>
        )}

        {/* Greeting */}
        <span className="hidden sm:inline text-gray-600">
          Hello, {user?.firstName || "User"}
        </span>

        {/* Profile Image */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
          alt="Profile"
          className="w-8 h-8 rounded-full border"
        />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-[#cf1112] hover:text-red-600 cursor-pointer transition"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
