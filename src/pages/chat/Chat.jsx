import { useSelector } from "react-redux";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";

const Chat = () => {
  const { selectedChat } = useSelector((state) => state.chat);

  return (
    <div className="flex flex-1 overflow-hidden w-full relative">
      {/* Chat List - hidden on mobile if a chat is selected */}
      <div className={`w-full md:w-[350px] h-full ${selectedChat ? "hidden md:flex" : "flex"}`}>
        <ChatList />
      </div>

      {/* Chat Window - hidden on mobile if no chat is selected */}
      <div className={`flex-1 w-full h-full ${!selectedChat ? "hidden md:flex" : "flex"}`}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;



