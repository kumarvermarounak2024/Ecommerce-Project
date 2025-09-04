import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Search,
  ShoppingCart,
  Heart,
  Bell,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const Navbar = ({ cartCount, onMenuToggle, isMenuOpen, onCartToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={onMenuToggle} className="md:hidden p-2">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center ml-2 md:ml-0">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Gyan Vidya
              </span>
            </div>
          </div>

          {/* Search Bar */}
          {/* <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search spiritual products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-orange-500">
              <Bell className="h-6 w-6" />
            </button>
            <button className="text-gray-600 hover:text-orange-500">
              <Heart className="h-6 w-6" />
            </button>
            <button
              onClick={onCartToggle}
              className="relative text-gray-600 hover:text-orange-500"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="text-gray-600 hover:text-orange-500">
              <User className="h-6 w-6" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 py-2 px-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
