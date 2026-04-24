import React, { useState } from "react";
import UpdatesSidebar from "../../components/UpdatesSidebar";
import StatusViewer from "../../components/StatusViewer";
import ChannelWindow from "../../components/ChannelWindow";
import StatusCreator from "../../components/StatusCreator";
import ChannelCreator from "../../components/ChannelCreator";

const UpdatesTab = () => {
    const [viewMode, setViewMode] = useState("EMPTY"); // EMPTY, STATUS_VIEWER, STATUS_CREATOR, CHANNEL_WINDOW
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    const handleStatusSelect = (statuses) => {
        setSelectedStatuses(statuses);
        setViewMode("STATUS_VIEWER");
    };

    const handlePostStatusClick = () => {
        setViewMode("STATUS_CREATOR");
    };

    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
        setViewMode("CHANNEL_WINDOW");
    };

    const handleChannelCreated = () => {
        handleRefresh();
    };

    const handleStatusPosted = () => {
        handleRefresh();
        setViewMode("EMPTY");
    };

    return (
        <div className="flex h-full w-full overflow-hidden animate-in fade-in duration-500">
            {/* LEFT SIDEBAR */}
            <UpdatesSidebar
                key={refreshKey}
                onStatusSelect={handleStatusSelect}
                onChannelSelect={handleChannelSelect}
                onPostStatus={handlePostStatusClick}
                onCreateChannel={() => setIsChannelModalOpen(true)}
                activeChannel={selectedChannel}
            />

            {/* MAIN CONTENT AREA (RIGHT PANE) */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-white dark:bg-[#0b141a]">
                {viewMode === "STATUS_CREATOR" && (
                    <StatusCreator
                        onCancel={() => setViewMode("EMPTY")}
                        onPosted={handleStatusPosted}
                    />
                )}

                {viewMode === "STATUS_VIEWER" && selectedStatuses.length > 0 && (
                    <StatusViewer
                        statuses={selectedStatuses}
                        onClose={() => setViewMode("EMPTY")}
                    />
                )}

                {viewMode === "CHANNEL_WINDOW" && selectedChannel && (
                    <ChannelWindow channel={selectedChannel} />
                )}

                {viewMode === "EMPTY" && (
                    <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-zinc-600 italic">
                        Select an update or channel to view details
                    </div>
                )}
            </main>

            {/* MODALS */}
            <ChannelCreator
                isOpen={isChannelModalOpen}
                onClose={() => setIsChannelModalOpen(false)}
                onCreated={handleChannelCreated}
            />
        </div>
    );
};

export default UpdatesTab;
