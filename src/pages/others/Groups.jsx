import { useSelector } from "react-redux";
import GroupList from "../../components/GroupList";
import GroupWindow from "../../components/GroupWindow";

const Groups = () => {
    const { selectedGroup } = useSelector((state) => state.group);

    return (
        <div className="flex flex-1 overflow-hidden w-full relative">
            <div className={`w-full md:w-[350px] h-full ${selectedGroup ? "hidden md:flex" : "flex"}`}>
                <GroupList />
            </div>
            <div className={`flex-1 w-full h-full ${!selectedGroup ? "hidden md:flex" : "flex"}`}>
                <GroupWindow />
            </div>
        </div>
    );
};

export default Groups;
