import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            Admin Panel
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
           
            <button
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              className="hover:underline flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-700">
          <button
            onClick={() => navigate("/admin/profile")}
            className="block w-full text-left px-4 py-2 hover:bg-primary-500"
          >
            <User size={18} className="inline-block mr-2" />
            Profile
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            className="block w-full text-left px-4 py-2 hover:bg-primary-500"
          >
            <LogOut size={18} className="inline-block mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
