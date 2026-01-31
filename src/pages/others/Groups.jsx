// src/pages/others/Groups.jsx
import React from "react";
import GroupList from "../../components/GroupList";
import GroupWindow from "../../components/GroupWindow";

const Groups = () => {
    return (
        <div className="flex flex-1 overflow-hidden w-full">
            <GroupList />
            <GroupWindow />
        </div>
    );
};

export default Groups;
