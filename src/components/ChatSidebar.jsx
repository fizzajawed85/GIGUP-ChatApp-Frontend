// src/components/ChatSidebar.jsx
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useSelector } from "react-redux";
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
  const { selectedChat } = useSelector((state) => state.chat);
  const { selectedGroup } = useSelector((state) => state.group);

  // Hide bottom bar on mobile if a specific window is open
  const isWindowOpen = !!(selectedChat || selectedGroup);

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

      {/* Mobile Bottom Bar — WhatsApp-style */}
      {!isWindowOpen && (
        <nav className="fixed bottom-0 left-0 right-0 z-[60] flex md:hidden bg-white dark:bg-[#111827] border-t border-zinc-200 dark:border-zinc-700 safe-area-pb h-14 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          {topIcons.concat(bottomIcons).map((item, idx) => {
            const IconComp = item.icon;
            const active = isActive(item.link);

            return (
              <Link
                key={idx}
                to={item.link}
                className="flex flex-col items-center justify-center flex-1 relative transition-all active:scale-75"
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-sky-500 shadow-[0_2px_10px_rgba(14,165,233,0.4)]" />
                )}
                <IconComp
                  className={`w-6 h-6 transition-all duration-300
                    ${active ? "text-sky-500 scale-110" : theme === "light" ? "text-gray-500" : "text-zinc-400"}
                  `}
                />
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
};

export default ChatSidebar;
