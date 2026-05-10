import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, MessageSquare, Search } from "lucide-react";

const Navbar = ({ user, onLogout, unreadCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 gradient-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold">👶 Cuidadora</div>
        </Link>

        {/* Search Bar */}
        {user && (
          <div className="hidden md:flex flex-1 mx-8 max-w-md">
            <input
              type="text"
              placeholder="Pesquisar babás..."
              className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
              onClick={() => navigate("/search")}
            />
          </div>
        )}

        {/* Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/search"
                className="hover:bg-purple-700 px-4 py-2 rounded-lg transition"
              >
                <Search size={20} />
              </Link>
              <Link
                to="/messages"
                className="relative hover:bg-purple-700 px-4 py-2 rounded-lg transition"
              >
                <MessageSquare size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="hover:bg-purple-700 px-4 py-2 rounded-lg transition"
              >
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg border-2 border-white bg-white/15 text-white font-semibold hover:bg-white/25 transition-all duration-300"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Registar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
