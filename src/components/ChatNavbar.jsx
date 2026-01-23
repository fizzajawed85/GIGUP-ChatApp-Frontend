import { useState } from "react";
import { FaSun, FaMoon, FaGoogle, FaFacebookF, FaSkype, FaPhoneAlt, FaBars } from "react-icons/fa";
import useTheme from "../hooks/useTheme"; 

const ChatNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoLight = "./images/logo.png";
  const logoDark = "./images/logo1.png";

  const hoverClass = "hover:bg-sky-400 dark:hover:bg-sky-500"; 
  const iconBtnClass = `p-3 rounded-full border border-blue-300 dark:border-zinc-600 transition ${hoverClass}`;

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-zinc-400 dark:border-zinc-600 bg-white dark:bg-gradient-to-b from-[#111727] to-[#111727] relative">
      
      {/* LEFT: Logo */}
      <div className="flex items-center">
        <img
          src={theme === "light" ? logoLight : logoDark}
          alt="Gigup Logo"
          className="w-36 h-auto"
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

        {/* Desktop Profile */}
        <img
          src={"#"}
          alt="Profile"
          className="hidden md:block w-10 h-10 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
          onClick={() => setIsDropdownOpen(prev => !prev)}
        />

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-3 rounded-full border border-blue-300 dark:border-zinc-600 transition hover:bg-sky-400 dark:hover:bg-sky-500"
          onClick={() => setIsDropdownOpen(prev => !prev)}
        >
          <FaBars className="text-gray-800 dark:text-[#fdf7f0]" />
        </button>

        {/* Dropdown for Mobile Hamburger / Desktop Profile */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1f2937] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* Profile Section */}
            <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Profile</p>
            <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Settings</p>
            <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Logout</p>

            {/* Future Menu Section */}
            <hr className="border-gray-300 dark:border-gray-600 my-1" />
            <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">-</p>
            <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">-</p>
            <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">-</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ChatNavbar;
