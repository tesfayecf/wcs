'use client'
import React from "react";
import GroupHandler from "../GroupHandler";
import TanksInfo from "../components/TanksInfo/TanksInfo";
import TankPopUp from "../components/TankPupUp/TankPopUp";
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
        <div className={"group"}>
            <div className={"info"}>
                <GroupInfoWidget />
                <GroupDescription />
            </div>
            <div className={"tanks"}>
                <TanksInfo />
            </div>
            <TankPopUp />
        </div>
    )
}

export default Tanks;