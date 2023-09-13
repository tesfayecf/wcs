'use client'
import React from "react";
import TanksHandler from "../TanksHandler";
import TankElements from "../components/TankElements/TankElements";
import TankPopUp from "../components/TankPupUp/TankPopUp";
import ToolsBar from "@/app/components/toolsBar/ToolsBar";
import GroupInfoWidget from "@/app/(pages)/tanks/components/GroupInfo/GroupInfoWidget";
import GroupDescription from "../components/GroupInfo/GroupDescription";

const tanksHandler = TanksHandler.getInstance();

interface IDashboardProps {
    params: {
        groupId: string
    }
}

const Tanks: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

    React.useEffect(() => {
        tanksHandler.load(props.params);
        return () => {
            tanksHandler.unload();
        }
    }, [])

    console.log("Rerender tanks page");

    return (
        <div id={"tanksPage"} className={"tanks"}>
            <div className={"tanksTools"}>
                <ToolsBar onCreate={() => tanksHandler.setShowTankMenu(true)} />
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