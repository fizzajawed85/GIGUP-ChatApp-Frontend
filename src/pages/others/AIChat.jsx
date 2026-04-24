import { useSelector } from "react-redux";
import AIChatSidebar from "../../components/AIChatSidebar";
import AIChatWindow from "../../components/AIChatWindow";

const AIChat = () => {
    const aiState = useSelector((state) => state.ai);
    const selectedConversation = aiState?.selectedConversation;

    return (
        <div className="flex flex-1 h-full overflow-hidden w-full relative bg-white dark:bg-[#0b1220]">
            {/* Sidebar (Chat History) */}
            <div className={`w-full md:w-[350px] h-full ${selectedConversation ? "hidden md:flex" : "flex"}`}>
                {aiState ? <AIChatSidebar /> : <div className="p-4">Loading AI...</div>}
            </div>

            {/* Chat Window */}
            <div className={`flex-1 w-full h-full ${!selectedConversation ? "hidden md:flex" : "flex"}`}>
                {selectedConversation ? <AIChatWindow /> : null}
            </div>
        </div>
    );
};

export default AIChat;
