import { ShoppingCart, UserPlus, LogOut, Lock, LogIn, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useSidebar } from "./SidebarContext";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const { isCollapsed } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar - Fixed at the top */}
      <div className="bg-white shadow p-4 fixed top-0 w-full z-50">
        <nav className="flex justify-between items-center">
          {/* Logo - Adjusts with sidebar and remains centered on mobile */}
          <Link
            to="/"
            className={`text-2xl font-bold text-emerald-400 flex items-center space-x-2 transition-all duration-300 ${
              isCollapsed ? "ml-16" : "ml-64"
            }`}
          >
            JJM MANUFACTURING
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-emerald-400 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={28} />
          </button>

          {/* Navbar Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-emerald-400 transition">
              Home
            </Link>

            {user && (
              <Link to="/cart" className="relative group text-gray-600 hover:text-emerald-400 transition">
                <ShoppingCart size={20} className="inline-block mr-1 group-hover:text-emerald-400" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium flex items-center transition"
                to="/dashboard"
              >
                <Lock size={18} className="mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition">
                  <UserPlus size={18} className="mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
                <Link to="/login" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition">
                  <LogIn size={18} className="mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu - Shown When Open */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col bg-white shadow-lg p-4 absolute top-full right-0 w-full border-t">
            <Link to="/" className="py-2 text-gray-600 hover:text-emerald-400 transition" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            {user && (
              <Link to="/cart" className="relative py-2 text-gray-600 hover:text-emerald-400 transition" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} className="inline-block mr-1 group-hover:text-emerald-400" />
                Cart ({cart.length})
              </Link>
            )}

            {isAdmin && (
              <Link
                className="py-2 bg-emerald-700 hover:bg-emerald-600 text-white px-3 rounded-md text-center"
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                className="py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex justify-center items-center"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </button>
            ) : (
              <>
                <Link to="/signup" className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
                <Link to="/login" className="py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-center" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
