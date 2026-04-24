import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups, setSelectedGroup } from "../redux/slices/groupSlice";
import { fetchGroupMessages } from "../redux/slices/groupMessageSlice";
import CreateGroupModal from "./CreateGroupModal";
import { FaPlus, FaSearch } from "react-icons/fa";
import { BASE_URL } from "../config";

const GroupList = () => {
    const dispatch = useDispatch();
    const { groups, selectedGroup, loading } = useSelector((state) => state.group);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const selectGroup = (group) => {
        dispatch(setSelectedGroup(group));
        dispatch(fetchGroupMessages(group._id));
    };

    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const authUserId = auth?.user?._id?.toString()?.toLowerCase();

    const getUserId = (u) => {
        if (!u) return "";
        let id = u._id ? u._id.toString() : u.toString();
        return id.toLowerCase();
    };

    const filteredGroups = groups.filter((group) =>
        group.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleGroupCreated = () => {
        dispatch(fetchGroups());
    };


    if (loading) return <div className="p-4">Loading groups...</div>;

    return (
        <div className="w-[350px] h-full flex flex-col border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0b1220]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-700 shrink-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 italic">Groups</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="p-2 rounded-full border border-blue-300 dark:border-zinc-600 transition hover:bg-[#1982c4] hover:text-white dark:hover:bg-[#1982c4] group"
                >
                    <FaPlus className="text-gray-900 dark:text-white group-hover:text-white" />
                </button>
            </div>

            {/* Search */}
            <div className="p-3 shrink-0">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search groups..."
                        className="w-full border rounded-md pl-10 pr-3 py-2 bg-[#f3f4f6] dark:bg-[#1f2937] text-black dark:text-white border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1982c4] transition"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredGroups.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 mt-10">
                        No groups found
                    </div>
                ) : (
                    filteredGroups.map((group) => (
                        <div
                            key={group._id}
                            onClick={() => selectGroup(group)}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${group._id === selectedGroup?._id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg overflow-hidden shrink-0">
                                {group.avatar ? (
                                    <img
                                        src={group.avatar.startsWith("http") ? group.avatar : `${BASE_URL}${group.avatar}`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    group.name[0]?.toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {group.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {group.members?.length || 0} members
                                </p>
                            </div>
                            {group.unreadCounts?.find(uc => getUserId(uc.user) === authUserId)?.count > 0 && (
                                <div className="bg-sky-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shrink-0">
                                    {group.unreadCounts.find(uc => getUserId(uc.user) === authUserId)?.count}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CreateGroupModal
                    onClose={() => setShowModal(false)}
                    onGroupCreated={handleGroupCreated}
                />
            )}
        </div>
    );
};

export default GroupList;
