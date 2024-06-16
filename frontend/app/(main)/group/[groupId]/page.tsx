import React from "react";
import TanksInfo from "./components/TanksInfo/TanksInfo";
import AddTankWidget from "./components/GroupInfo/AddTankWidget";
import GroupInfoWidget from "@/app/(main)/group/[groupId]/components/GroupInfo/GroupInfoWidget";
import GroupDescription from "@/app/(main)/group/[groupId]/components/GroupInfo/GroupDescription";

import { getGroup, getTanks } from "./actions";
import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import InfoWidget from "./components/InfoWidget/InfoWidget";
import DataWidget from "./components/DataWidget/DataWidget";
import TankPopUp from "./components/TankPupUp/TankPopUp";


interface IDashboardProps {
    params: {
        groupId: string
    }
}

const Group: React.FunctionComponent<IDashboardProps> = async (props: IDashboardProps) => {

    //////////////////////////////////////////////////////////
    //////////////////// LOAD GROUP STATE ////////////////////
    //////////////////////////////////////////////////////////

    const tanksResponse = await getTanks(parseInt(props.params.groupId));
    const groupResponse = await getGroup(parseInt(props.params.groupId));

    return (
        <div className={"group"}>
            <StoreInitializer
                group={{
                    groupParam: props.params.groupId,
                    tanks: tanksResponse.data,
                    groupInfo: groupResponse
                }}
            />
            <div className={"status"}>
                <GroupInfoWidget />
                <GroupDescription />
                <AddTankWidget />
            </div>
            <div className={"general"}>
                <div className={"info"}>
                    <InfoWidget title='Inflow' value={241.24} changeValue={23} color='#3de198' />
                    <InfoWidget title='Outflow' value={872.27} changeValue={-5} color='#e07159' />
                    <InfoWidget title='Savings' value={35} changeValue={5} color='#f2c986' />
                </div>
                <div className={"tanks"}>
                    <TanksInfo />
                </div>
                <div className={"data"}>
                    <DataWidget />
                </div>
            </div>
            <TankPopUp />
        </div>
    )
}

export default Group;