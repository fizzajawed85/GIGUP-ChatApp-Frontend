import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useTheme from "../../hooks/useTheme";
import {
    FiChevronRight,
    FiUser,
    FiShield,
    FiMessageSquare,
    FiBell,
    FiHelpCircle,
    FiMoon,
    FiSun,
    FiEdit3,
    FiDatabase
} from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";

import { BASE_URL } from "../../config";

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const logoLight = "./images/logo.png";
    const logoDark = "./images/logo1.png";
    const auth = JSON.parse(localStorage.getItem("auth"));
    const user = auth?.user;

    const SettingItem = ({ icon: Icon, title, subtitle, onClick, textColor = "" }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 shadow-sm border border-sky-100 dark:border-sky-500/20">
                    <Icon className="text-xl" />
                </div>
                <div className="text-left overflow-hidden">
                    <h4 className={`text-sm font-bold ${textColor || "text-gray-900 dark:text-zinc-100"}`}>{title}</h4>
                    {subtitle && <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 truncate">{subtitle}</p>}
                </div>
            </div>
            <FiChevronRight className="text-zinc-300 dark:text-zinc-600 transition-transform group-hover:translate-x-1" />
        </button>
    );

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#0b1220] overflow-hidden">
            {/* HEADER */}
            <div className="px-4 md:px-8 py-5 md:py-8 border-b dark:border-zinc-800 bg-zinc-50/30 dark:bg-black/20 flex items-center gap-3 md:gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 rounded-2xl bg-white dark:bg-[#111727] text-sky-500 shadow-sm border border-zinc-100 dark:border-white/5 active:scale-95 transition-all"
                >
                    <BsArrowLeft className="text-xl" />
                </button>
                <div>
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Preferences</h2>
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.3em]">Configure System Identity</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* PROFILE PREVIEW */}
                <div className="p-6">
                    <div
                        onClick={() => navigate("/profile")}
                        className="bg-white dark:bg-[#1f2937]/30 border border-zinc-100 dark:border-white/5 rounded-[24px] md:rounded-[32px] p-4 md:p-6 flex items-center justify-between cursor-pointer hover:border-sky-500/30 transition-all shadow-sm group"
                    >
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <img
                                    src={user?.avatar ? `${BASE_URL}${user.avatar}` : "/avatar.png"}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-zinc-700 shadow-xl"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-sky-500 p-1.5 rounded-full border-2 border-white dark:border-[#1f2937] text-white">
                                    <FiEdit3 className="text-xs" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{user?.username || "GIGUP User"}</h3>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest truncate">{user?.about || "Always connected to the pulse"}</p>
                            </div>
                        </div>
                        <FiChevronRight className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* SETTINGS CATEGORIES */}
                <div className="space-y-1">
                    <div className="px-8 py-2">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Universal Settings</span>
                    </div>

                    <SettingItem
                        icon={FiUser}
                        title="Account"
                        subtitle="Security notifications, change number"
                        onClick={() => toast("Feature coming soon! 🚀", { icon: '⏳' })}
                    />

                    <SettingItem
                        icon={FiShield}
                        title="Privacy"
                        subtitle="Block contacts, disappearing messages"
                        onClick={() => toast("Feature coming soon! 🚀", { icon: '⏳' })}
                    />

                    <SettingItem
                        icon={FiMoon}
                        title="Appearance"
                        subtitle={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
                        onClick={toggleTheme}
                    />

                    <div className="px-8 py-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Communication</span>
                    </div>

                    <SettingItem
                        icon={FiMessageSquare}
                        title="Chats"
                        subtitle="Theme, wallpapers, chat history"
                        onClick={() => toast("Feature coming soon! 🚀", { icon: '⏳' })}
                    />

                    <SettingItem
                        icon={FiBell}
                        title="Notifications"
                        subtitle="Message, group & call tones"
                        onClick={() => toast("Feature coming soon! 🚀", { icon: '⏳' })}
                    />

                    <SettingItem
                        icon={FiDatabase}
                        title="Storage and Data"
                        subtitle="Network usage, auto-download"
                        onClick={() => toast("Feature coming soon! 🚀", { icon: '⏳' })}
                    />

                    <div className="px-8 py-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Support</span>
                    </div>

                    <SettingItem
                        icon={FiHelpCircle}
                        title="Help"
                        subtitle="Help center, contact us, privacy policy"
                        onClick={() => toast("Feature coming soon! 🚀", { icon: '⏳' })}
                    />
                </div>

                {/* VERSION FOOTER */}
                <div className="p-12 pb-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-70">
                        <img
                            src={theme === "light" ? logoLight : logoDark}
                            alt="Logo"
                            className="w-40 h-auto mb-3"
                        />
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">GIGUP for Windows</h5>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1">Version 2.4.0 (Stable)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
