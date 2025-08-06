import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // React Router
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `
      relative inline-block px-2 py-1
      text-gray-700 hover:text-primary-600
      after:content-['']
      after:absolute after:left-0 after:bottom-0
      after:h-[2px] after:w-0
      after:bg-primary-600
      after:transition-all after:duration-300
      hover:after:w-full
      ${isActive ? "text-primary-600 after:w-full" : ""}
    `;

  const MobileNavLink = ({
    to,
    label,
    onClick,
  }: {
    to: string;
    label: string;
    onClick?: () => void;
  }) => (
    <NavLink
      to={to}
      className={navLinkClass}
      onClick={() => {
        setIsMenuOpen(false);
        onClick?.();
      }}
    >
      {label}
    </NavLink>
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary-600">
            DevShare Lite
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/posts" className={navLinkClass}>
              Posts
            </NavLink>
            {user && (
              <NavLink to="/create-post" className={navLinkClass}>
                Create Post
              </NavLink>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  {user.name}
                </NavLink>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-2">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/posts" label="Posts" />
            {user && <MobileNavLink to="/create-post" label="Create Post" />}
            {user ? (
              <>
                <MobileNavLink to="/profile" label="Profile" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-2 py-1 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
