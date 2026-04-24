import { useSelector } from "react-redux";
import AIChatSidebar from "../../components/AIChatSidebar";
import AIChatWindow from "../../components/AIChatWindow";

const AIChat = () => {
    const { selectedConversation } = useSelector((state) => state.ai);

    return (
        <div className="flex h-full overflow-hidden w-full relative">
            {/* Sidebar (Chat History) - hidden on mobile if a conversation is selected */}
            <div className={`w-full md:w-[350px] h-full ${selectedConversation ? "hidden md:flex" : "flex"}`}>
                <AIChatSidebar />
            </div>

            {/* Chat Window - hidden on mobile if no conversation is selected */}
            <div className={`flex-1 w-full h-full ${!selectedConversation ? "hidden md:flex" : "flex"}`}>
                <AIChatWindow />
            </div>
        </div>
    );
};

export default AIChat;
