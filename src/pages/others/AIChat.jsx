import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AIChatSidebar from "../../components/AIChatSidebar";
import AIChatWindow from "../../components/AIChatWindow";

const AIChat = () => {
    const aiState = useSelector((state) => state.ai);
    const selectedConversation = aiState?.selectedConversation;
    const [forceWindow, setForceWindow] = useState(false);

    // Reset forceWindow when selecting an existing conversation
    useEffect(() => {
        if (selectedConversation) setForceWindow(false);
    }, [selectedConversation]);

    const handleNewChatMobile = () => {
        setForceWindow(true);
    };

    const showWindow = selectedConversation || forceWindow;

    return (
        <div className="flex flex-1 h-full overflow-hidden w-full relative bg-white dark:bg-[#0b1220]">
            {/* Sidebar (Chat History) */}
            <div className={`w-full md:w-[350px] h-full ${showWindow ? "hidden md:flex" : "flex"}`}>
                {aiState ? <AIChatSidebar onNewChat={handleNewChatMobile} /> : <div className="p-4">Loading AI...</div>}
            </div>

            {/* Chat Window */}
            <div className={`flex-1 w-full h-full ${!showWindow ? "hidden md:flex" : "flex"}`}>
                <AIChatWindow onBack={() => setForceWindow(false)} />
            </div>
        </div>
    );
};

export default AIChat;
