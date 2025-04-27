import { ShoppingCart, UserPlus, LogOut, Lock, LogIn, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useSidebar } from "./SidebarContext";
import Notification from "./Notification";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const isAudit = user?.role === "audit";
  const isAuditor = user?.role === "auditor";
  const isSuperAdmin = user?.role === "superadmin";
  const { cart } = useCartStore();
  const { isCollapsed } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Navbar - Fixed at the top */}
      <div className={`bg-white shadow p-4 fixed top-0 w-full z-50 ${isAuditor ? "bg-white " : ""}`}>
        <nav className="flex justify-between items-center">
          {/* Logo - Adjusts with sidebar and remains centered on mobile */}
          {isAdmin ? (
            <>
            <Link
              to="/dashboard"
              className={`text-2xl font-bold text-green-500 flex items-center space-x-2 transition-all duration-300 ${
                isCollapsed ? "ml-16" : "ml-64"
              }`}
            >
              JJM ADMIN
            </Link>
            
            </>
          ) : isAudit ? (
            <Link
              to="/auditDashboard"
               className={`text-2xl font-bold text-green-500 flex items-center space-x-2 transition-all duration-300 ${
                isCollapsed ? "ml-16" : "ml-64"
              }`}
            >
              JJM AUDIT ADMIN
            </Link>
          ) : isAuditor ? (
            <Link
              to="/auditorDashboard"
               className={`text-2xl font-bold text-green-500 flex items-center space-x-2 transition-all duration-300 ${
                isCollapsed ? "ml-16" : "ml-64"
              }`}
            >
              JJM AUDITOR
            </Link>
          ) : isSuperAdmin ? (
            <Link
                to="/superAdminPage"
              className={`text-2xl font-bold z-0 text-green-500 flex items-center space-x-2 transition-all duration-300 ${
                isCollapsed ? "ml-16" : "ml-64"
              }`}
              >
                JJM SUPER ADMIN
              </Link>
          ) : (
            <Link
              to="/"
              className="text-2xl font-bold text-green-500 flex items-center space-x-2 transition-all duration-300"
            >
              JJM MANUFACTURING
            </Link>
          )}

          

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-emerald-400 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={28} />
          </button>

          
          <div className="hidden md:flex items-center gap-2">

            {user ? (
              <>
               {!isAdmin && !isAudit && !isAuditor && !isSuperAdmin && (
                  <Link to="/" className="text-gray-600 hover:text-emerald-400 transition">
                    Home
                  </Link>
                )}

                {!isAdmin && !isAudit && !isAuditor && !isSuperAdmin && (
                  <>
                  <Link to="/cart" className="relative group text-gray-600 hover:text-emerald-400 transition">
                    <ShoppingCart size={20} className="inline-block mr-1 group-hover:text-emerald-400" />
                    <span className="hidden sm:inline">Cart</span>
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  </>
                )}

                {(isAdmin || isAudit) && <Notification />}


                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-60 p-2 shadow">
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 ">Name: {user.name}</span>
                        <span className="block text-sm  text-gray-500 truncate ">Email: {user.email}</span>
                      </div>
                      <hr className="h-px mb-2 bg-gray-200 border-0 "></hr>
                    {!isAdmin && !isAudit && !isAuditor && !isSuperAdmin &&
                    <li>
                      <a href="/purchasePage">My Purchase</a>
                    </li>
                    }
                    <li>
                      <a onClick={handleLogout}>Logout</a>
                    </li>
                  </ul>
                </div>
              </>
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
          <div className="md:hidden mt-4 z-100 flex flex-col bg-white shadow-lg p-4 absolute top-full right-0 w-full border-t">
            {!isAdmin && !isAudit && !isAuditor && !isSuperAdmin && user &&(
              <Link to="/" className="py-2 text-gray-600 hover:text-emerald-400 transition" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            )}

            {!isAdmin && !isAudit && !isAuditor && !isSuperAdmin && user && (
              <Link to="/cart" className="relative py-2 text-gray-600 hover:text-emerald-400 transition" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} className="inline-block mr-1 group-hover:text-emerald-400" />
                Cart ({cart.length})
              </Link>
            )}

            {!isAdmin && !isAudit && !isAuditor && !isSuperAdmin && user && (
            <div className="py-2 text-gray-600 hover:text-emerald-400 transition">
              <a  href="/purchasePage" >My Purchase</a>
            </div>
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
