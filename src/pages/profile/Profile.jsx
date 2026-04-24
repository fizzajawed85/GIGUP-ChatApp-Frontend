import React, { useState, useEffect } from "react";
import { FaCamera, FaSave, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt } from "react-icons/fa";
import { getProfile, updateProfile, uploadAvatar, uploadCover } from "../../services/userService";
import { BASE_URL } from "../../config";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        username: "",
        email: "",
        about: "",
        phoneNumber: "",
        location: "",
        socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
        avatar: "",
        coverImage: ""
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const bioTemplates = [
        "Exploring the world of tech! 🚀",
        "Living life one cup of coffee at a time. ☕",
        "Passionate about code and creativity. ✨",
        "Always learning, always growing. 🌱",
        "Tech enthusiast | Music lover | Dreamer 🎧"
    ];

    const statusOptions = [
        { label: "Available", color: "bg-green-500", icon: "🟢" },
        { label: "Busy", color: "bg-red-500", icon: "🔴" },
        { label: "At Work", color: "bg-blue-500", icon: "💼" },
        { label: "Battery About to Die", color: "bg-yellow-500", icon: "🪫" },
        { label: "Away", color: "bg-gray-400", icon: "🕒" }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setUser(data);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("social.")) {
            const socialKey = name.split(".")[1];
            setUser(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [socialKey]: value }
            }));
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            const formData = new FormData();
            formData.append("avatar", file);
            setUploading(true);
            try {
                const res = await uploadAvatar(formData);
                setUser(prev => ({ ...prev, avatar: res.avatar }));

                // Update local auth
                const currentAuth = JSON.parse(localStorage.getItem("auth"));
                if (currentAuth) {
                    currentAuth.user.avatar = res.avatar;
                    localStorage.setItem("auth", JSON.stringify(currentAuth));

                    // Sync with account switcher list
                    const accounts = JSON.parse(localStorage.getItem("gigup_accounts") || "[]");
                    const accIndex = accounts.findIndex(acc => acc.user.email === currentAuth.user.email);
                    if (accIndex !== -1) {
                        accounts[accIndex] = currentAuth;
                        localStorage.setItem("gigup_accounts", JSON.stringify(accounts));
                    }
                }
                alert("Avatar updated!");
            } catch (error) {
                console.error(error);
                alert("Failed to upload avatar");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
            const formData = new FormData();
            formData.append("coverImage", file);
            setUploading(true);
            try {
                const res = await uploadCover(formData);
                setUser(prev => ({ ...prev, coverImage: res.coverImage }));
                alert("Cover image updated!");
            } catch (error) {
                console.error(error);
                alert("Failed to upload cover image");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(user);

            // Update local auth storage
            const currentAuth = JSON.parse(localStorage.getItem("auth"));
            if (currentAuth) {
                currentAuth.user = { ...currentAuth.user, ...user };
                localStorage.setItem("auth", JSON.stringify(currentAuth));

                // Sync with account switcher list
                const accounts = JSON.parse(localStorage.getItem("gigup_accounts") || "[]");
                const accIndex = accounts.findIndex(acc => acc.user.email === currentAuth.user.email);
                if (accIndex !== -1) {
                    accounts[accIndex] = currentAuth;
                    localStorage.setItem("gigup_accounts", JSON.stringify(accounts));
                }
            }
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    };

    if (loading) return <div className="p-10 text-center dark:text-white">Loading Profile...</div>;

    return (
        <div className="flex-1 overflow-y-auto h-full p-4 md:p-6 bg-white dark:bg-[#111727]">  {/* Matched dark theme bg */}
            <div className="max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">

                {/* Cover Image Area */}
                <div className="h-48 md:h-64 relative bg-gray-300 dark:bg-gray-700 group">
                    <img
                        src={coverPreview || (user.coverImage ? `${BASE_URL}${user.coverImage}` : "https://via.placeholder.com/800x300")}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <label className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full cursor-pointer hover:bg-black/70 transition opacity-0 group-hover:opacity-100">
                        <FaCamera />
                        <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} disabled={uploading} />
                    </label>
                </div>

                <div className="px-8 pb-8 bg-white dark:bg-[#1f2937]"> {/* Card content bg */}
                    <div className="relative flex justify-between items-end -mt-16 mb-6">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#1f2937] overflow-hidden bg-gray-300">
                                <img
                                    src={avatarPreview || (user.avatar ? `${BASE_URL}${user.avatar}` : "https://via.placeholder.com/150")}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="absolute bottom-2 right-2 bg-sky-500 dark:bg-sky-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-sky-600 dark:hover:bg-sky-700 transition shadow-lg z-10">
                                <FaCamera />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
                            </label>
                        </div>

                        <div className="flex-1 ml-6 text-gray-800 dark:text-white pb-2">
                            <h1 className="text-3xl font-bold">{user.username}</h1>
                            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-lg shadow-md transition flex items-center gap-2 mb-2"
                        >
                            <FaSave /> Save
                        </button>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-200">

                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">About Me / Bio</label>
                                <textarea
                                    name="about"
                                    rows="3"
                                    value={user.about}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-sky-500 focus:bg-white dark:focus:bg-gray-700 transition outline-none resize-none"
                                    placeholder="Tell us about yourself..."
                                ></textarea>

                                {/* Quick Bio Templates */}
                                <div className="mt-3">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Templates</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {bioTemplates.map((template, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setUser({ ...user, about: template })}
                                                className="text-xs px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-800 transition shadow-sm"
                                            >
                                                {template}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaMapMarkerAlt className="text-sky-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        value={user.location}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-sky-500 focus:bg-white dark:focus:bg-gray-700 transition outline-none shadow-sm"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Current Status</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => setUser({ ...user, status: opt.label })}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition shadow-sm ${user.status === opt.label
                                                ? 'bg-sky-50 dark:bg-sky-900/40 border-sky-400 dark:border-sky-500'
                                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${opt.color} shadow-sm`}></span>
                                                <span className="font-medium text-sm">{opt.label}</span>
                                            </div>
                                            <span className="text-lg">{opt.icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold border-b dark:border-gray-600 pb-2">Social Links</h3>

                            <div className="flex items-center gap-3">
                                <FaFacebook className="text-blue-600 text-xl" />
                                <input
                                    type="text"
                                    name="social.facebook"
                                    value={user.socialLinks?.facebook || ""}
                                    onChange={handleChange}
                                    className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-sky-500 outline-none"
                                    placeholder="Facebook Profile URL"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <FaTwitter className="text-sky-500 text-xl" />
                                <input
                                    type="text"
                                    name="social.twitter"
                                    value={user.socialLinks?.twitter || ""}
                                    onChange={handleChange}
                                    className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-sky-500 outline-none"
                                    placeholder="Twitter Profile URL"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <FaInstagram className="text-pink-500 text-xl" />
                                <input
                                    type="text"
                                    name="social.instagram"
                                    value={user.socialLinks?.instagram || ""}
                                    onChange={handleChange}
                                    className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-sky-500 outline-none"
                                    placeholder="Instagram Profile URL"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <FaLinkedin className="text-blue-700 text-xl" />
                                <input
                                    type="text"
                                    name="social.linkedin"
                                    value={user.socialLinks?.linkedin || ""}
                                    onChange={handleChange}
                                    className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-sky-500 outline-none"
                                    placeholder="LinkedIn Profile URL"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
