import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, User, LogOut, X } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation(); // get current route
  const navigate = useNavigate(); // to navigate programmatically

  // Check which tab is active
  const isSettingsPage = location.pathname === '/settings';
  const isProfilePage = location.pathname === '/profile';

  const closeTab = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src="/chamts.png" className="w-5 h-5" alt="" />
              </div>
              <h1 className="text-lg font-bold">Chamts</h1>
            </Link>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-2">

            {/* Settings */}
            <Link to="/settings" className="btn btn-sm gap-2 relative">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>

              {/* Show close only if this page is active */}
              {isSettingsPage && (
                <button
                  onClick={closeTab}
                  className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center rounded-full bg-gray-500 text-white text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Link>

            {/* Profile */}
            {authUser && (
              <Link to="/profile" className="btn btn-sm gap-2 relative">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>

                {isProfilePage && (
                  <button
                    onClick={closeTab}
                    className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center rounded-full bg-gray-500 text-white text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Link>
            )}

            {/* Logout */}
            {authUser && (
              <button className="btn btn-sm gap-2" onClick={logout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
