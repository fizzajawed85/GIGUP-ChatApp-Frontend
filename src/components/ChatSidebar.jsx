// src/components/ChatSidebar.jsx
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { TbCircleDot } from "react-icons/tb";
import {
  MdGroups, MdCall, MdContactPage, MdSettings, MdLogout
} from "react-icons/md";
import useTheme from "../hooks/useTheme";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ChatSidebar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const topIcons = [
    { icon: AiOutlineComment, label: "Chat", link: "/chat" },
    { icon: TbCircleDot, label: "Updates", link: "/updates" },
    { icon: MdGroups, label: "Group", link: "/groups" },
    { icon: MdCall, label: "Call", link: "/calls" },
    { icon: MdContactPage, label: "Contacts", link: "/contacts" },
    { icon: FaRobot, label: "AI Chat", link: "/ai-chat" }
  ];

  const bottomIcons = [
    { icon: MdSettings, label: "Settings", link: "/settings" }
  ];

  const baseIconClass = `w-8 h-8 transition-all duration-300
    ${theme === "light" ? "text-gray-800" : "text-[#fdf7f0]"}`;

  const hoverIconClass =
    "hover:text-sky-400 dark:hover:text-sky-500 hover:scale-110";

  const activeBg =
    theme === "light" ? "bg-sky-400" : "bg-sky-700";

  const isActive = (link) => link !== "#" && pathname.startsWith(link);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col justify-between items-center w-20 bg-white dark:bg-[#111827] border-r border-zinc-300 dark:border-zinc-600 pt-4 pb-4 h-full overflow-y-auto no-scrollbar"
      >
        {/* Top Icons */}
        <div className="flex flex-col items-center w-full">
          {topIcons.map((item, idx) => {
            const IconComp = item.icon;
            const active = isActive(item.link);

            return (
              <Link
                key={idx}
                to={item.link}
                className={`relative group w-full flex justify-center py-3 transition
                  ${active ? activeBg : ""}
                `}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <IconComp
                  className={`${baseIconClass} ${!active ? hoverIconClass : ""
                    }`}
                />

                {hovered === item.label && !active && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-gray-800 text-white text-sm whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center w-full mb-2">
          {bottomIcons.map((item, idx) => {
            const IconComp = item.icon;
            const active = isActive(item.link);

            return (
              <Link
                key={idx}
                to={item.link}
                className={`relative group w-full flex justify-center py-3 transition
                  ${active ? activeBg : ""}
                `}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <IconComp
                  className={`${baseIconClass} ${!active ? hoverIconClass : ""
                    }`}
                />

                {hovered === item.label && !active && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-gray-800 text-white text-sm whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Custom Logout Button */}
          <button
            onClick={handleLogout}
            className="relative group w-full flex justify-center py-3 transition hover:bg-red-500 hover:text-white rounded-lg"
            onMouseEnter={() => setHovered("Logout")}
            onMouseLeave={() => setHovered(null)}
          >
            <MdLogout
              className={`w-8 h-8 transition-all duration-300 ${theme === "light" ? "text-gray-800" : "text-[#fdf7f0]"
                } group-hover:text-white`}
            />

            {hovered === "Logout" && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-red-600 text-white text-sm whitespace-nowrap z-50">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#111827] border-t border-zinc-300 dark:border-zinc-600 flex md:hidden overflow-x-auto py-2 px-2 gap-2">
        {topIcons.concat(bottomIcons).map((item, idx) => {
          const IconComp = item.icon;
          const active = isActive(item.link);

          return (
            <Link
              key={idx}
              to={item.link}
              className={`flex flex-col items-center shrink-0 w-1/4 py-1 rounded-lg
                ${active ? activeBg : ""}
              `}
            >
              <IconComp
                className={`w-7 h-7 transition-all duration-300
                  ${theme === "light" ? "text-gray-800" : "text-[#fdf7f0]"}
                  ${!active ? "hover:text-sky-400 dark:hover:text-sky-500 hover:scale-110" : ""}
                `}
              />
              <span className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Mobile Custom Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center shrink-0 w-1/4 py-1 rounded-lg hover:bg-red-500 group"
        >
          <MdLogout
            className={`w-7 h-7 transition-all duration-300 ${theme === "light" ? "text-gray-800" : "text-[#fdf7f0]"
              } group-hover:text-white`}
          />
          <span className="text-xs text-gray-700 dark:text-gray-200 mt-1 group-hover:text-white">
            Logout
          </span>
        </button>
      </nav>
    </>
  );
};

export default ChatSidebar;
