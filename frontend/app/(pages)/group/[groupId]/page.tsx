'use client'
import React from "react";
import GroupHandler from "../GroupHandler";
import TankElements from "../components/TankElements/TankElements";
import TankPopUp from "../components/TankPupUp/TankPopUp";
import ToolsBar from "@/app/components/toolsBar/ToolsBar";
import GroupInfoWidget from "@/app/(pages)/group/components/GroupInfo/GroupInfoWidget";
import GroupDescription from "../components/GroupInfo/GroupDescription";

const groupHandler = GroupHandler.getInstance();

interface IDashboardProps {
    params: {
        groupId: string
    }
}

const Tanks: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

    React.useEffect(() => {
        groupHandler.load(props.params);
        return () => {
            groupHandler.unload();
        }
    }, [])

    return (
        <div id={"tanksPage"} className={"tanks"}>
            <div className={"tanksTools"}>
                <ToolsBar onCreate={() => groupHandler.setShowTankMenu(true)} />
            </div>
            <div className={"tankElements"}>
                <div className={"groupMenu"}>
                    <GroupInfoWidget />
                    <GroupDescription />
                </div>
                <TankElements />
                <TankPopUp />
            </div>
        </div>
    )
}

export default Tanks;