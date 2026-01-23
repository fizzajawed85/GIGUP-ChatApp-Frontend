// src/components/ChatSidebar.jsx
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { TbCircleDot } from "react-icons/tb";
import {
  MdGroups, MdCall, MdContactPage, MdSettings, MdLogout
} from "react-icons/md";
import useTheme from "../hooks/useTheme";
import { Link, useLocation } from "react-router-dom";

const ChatSidebar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState(null);

  const topIcons = [
    { icon: AiOutlineComment, label: "Chat", link: "/chat" },
    { icon: TbCircleDot, label: "Status", link: "#" },
    { icon: MdGroups, label: "Group", link: "#" },
    { icon: MdCall, label: "Call", link: "#" },
    { icon: MdContactPage, label: "Contacts", link: "#" },
    { icon: FaRobot, label: "AI Chat", link: "#" }
  ];

  const bottomIcons = [
    { icon: MdSettings, label: "Settings", link: "#" },
    { icon: MdLogout, label: "Logout", link: "#" }
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
        className="hidden md:flex flex-col justify-between items-center w-20 bg-white dark:bg-[#111827] border-r border-zinc-300 dark:border-zinc-600 py-4"
        style={{ height: "calc(100vh - 50px)" }}
      >
        {/* Top Icons */}
        <div className="flex flex-col items-center  w-full">
          {topIcons.map((item, idx) => {
            const IconComp = item.icon;
            const active = isActive(item.link);

            return (
              <Link
                key={idx}
                to={item.link}
                className={`relative group w-full flex justify-center py-4 transition
                  ${active ? activeBg : ""}
                `}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <IconComp
                  className={`${baseIconClass} ${
                    !active ? hoverIconClass : ""
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
                  className={`${baseIconClass} ${
                    !active ? hoverIconClass : ""
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
      </nav>
    </>
  );
};

export default ChatSidebar;
