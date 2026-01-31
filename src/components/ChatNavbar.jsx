import { useState, useContext } from "react";
import { FaSun, FaMoon, FaGoogle, FaFacebookF, FaSkype, FaPhoneAlt, FaBars, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { NotificationContext } from "../context/NotificationContext";

const ChatNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar, unreadCount } = useContext(NotificationContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const logoLight = "./images/logo.png";
  const logoDark = "./images/logo1.png";

  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth?.user;

  // Multi-account logic
  const accounts = JSON.parse(localStorage.getItem("gigup_accounts") || "[]");
  const otherAccounts = accounts.filter(acc => acc.user.email !== user?.email);

  const hoverClass = "hover:bg-sky-400 dark:hover:bg-sky-500";
  const iconBtnClass = `p-3 rounded-full border border-blue-300 dark:border-zinc-600 transition ${hoverClass}`;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const handleSwitchAccount = (acc) => {
    localStorage.setItem("auth", JSON.stringify(acc));
    setIsDropdownOpen(false);
    // Reload to refresh all state/sockets
    window.location.reload();
  };

  const handleAddAccount = () => {
    // Navigate to login while keeping existing accounts
    navigate("/login");
    setIsDropdownOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-zinc-400 dark:border-zinc-600 bg-white dark:bg-gradient-to-b from-[#111727] to-[#111727] relative">

      {/* LEFT: Logo */}
      <div className="flex items-center">
        <img
          src={theme === "light" ? logoLight : logoDark}
          alt="Gigup Logo"
          className="w-36 h-auto cursor-pointer"
          onClick={() => navigate("/chat")}
        />
      </div>

      {/* CENTER: Social Icons (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-3">
        <button className={iconBtnClass}>
          <FaGoogle className={theme === "light" ? "text-black" : "text-[#fdf7f0]"} />
        </button>
        <button className={iconBtnClass}>
          <FaFacebookF className={theme === "light" ? "text-black" : "text-[#fdf7f0]"} />
        </button>
        <button className={iconBtnClass}>
          <FaSkype className={theme === "light" ? "text-black" : "text-[#fdf7f0]"} />
        </button>
        <button className={iconBtnClass}>
          <FaPhoneAlt className={theme === "light" ? "text-black" : "text-[#fdf7f0]"} />
        </button>
      </div>

      {/* RIGHT: Light/Dark Toggle + Hamburger/Profile */}
      <div className="flex items-center gap-3 relative">
        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className={iconBtnClass}
        >
          {theme === "light" ? <FaMoon className="text-black" /> : <FaSun className="text-[#fdf7f0]" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={toggleSidebar}
          className={`${iconBtnClass} relative`}
        >
          <FaBell className={theme === "light" ? "text-black" : "text-[#fdf7f0]"} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Desktop Profile */}
        <div className="relative">
          <img
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : "/avatar.png"}
            alt="Profile"
            className="hidden md:block w-10 h-10 rounded-full cursor-pointer border border-sky-400 dark:border-sky-500 object-cover hover:ring-2 ring-sky-300 transition-all"
            onClick={() => setIsDropdownOpen(prev => !prev)}
          />
          {/* Status Dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-3 rounded-full border border-blue-300 dark:border-zinc-600 transition hover:bg-sky-400 dark:hover:bg-sky-500"
          onClick={() => setIsDropdownOpen(prev => !prev)}
        >
          <FaBars className="text-gray-800 dark:text-[#fdf7f0]" />
        </button>

        {/* Dropdown for Mobile Hamburger / Desktop Profile */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-[#1f2937] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-3 z-50 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            {/* User Info */}
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.username || "User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>

            <div className="py-2">
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-2.5 hover:bg-sky-50 dark:hover:bg-sky-900/30 cursor-pointer text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors">
                Your Profile
              </Link>
              <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-2.5 hover:bg-sky-50 dark:hover:bg-sky-900/30 cursor-pointer text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors">
                Settings
              </Link>
            </div>

            {/* SWITCH ACCOUNT SECTION */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 pb-1 bg-gray-50/50 dark:bg-gray-800/50">
              <p className="px-5 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Switch Account</p>

              <div className="max-h-32 overflow-y-auto custom-scrollbar">
                {otherAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSwitchAccount(acc)}
                    className="flex items-center gap-3 px-5 py-2 hover:bg-white dark:hover:bg-[#2d3748] cursor-pointer group transition-all"
                  >
                    <img
                      src={acc.user.avatar ? `http://localhost:5000${acc.user.avatar}` : "/avatar.png"}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      alt="Acc"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate group-hover:text-sky-500">{acc.user.username}</p>
                      <p className="text-[10px] text-gray-500 truncate">{acc.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                onClick={handleAddAccount}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-white dark:hover:bg-[#2d3748] cursor-pointer text-sky-500 text-xs font-semibold transition-all border-t border-gray-100 dark:border-gray-700/50"
              >
                <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center border border-sky-200 dark:border-sky-800">
                  <span className="text-lg">+</span>
                </div>
                Add Another Account
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
              <div
                onClick={handleLogout}
                className="px-5 py-3 hover:bg-red-50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer transition-colors text-sm font-bold flex items-center gap-2"
              >
                Logout
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ChatNavbar;
