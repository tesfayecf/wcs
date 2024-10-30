'use client'
import React from "react";
import TanksInfo from "./components/TanksInfo/TanksInfo";
import CreateTankWidget from "./components/GroupInfo/AddTankWidget";
import GroupInfoWidget from "@/app/(app)/group/[groupId]/components/GroupInfo/GroupInfoWidget";
import GroupDescription from "@/app/(app)/group/[groupId]/components/GroupInfo/GroupDescription";
import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import InfoWidget from "@/app/components/infoWidget/InfoWidget";
import DataWidget from "./components/DataWidget/DataWidget";
import TankPopUp from "./components/TankPupUp/TankPopUp";
import { getGroup, getTanks } from "./actions";

interface IDashboardProps {
    params: {
        groupId: string
    }
}

const Group: React.FunctionComponent<IDashboardProps> = async (props: IDashboardProps) => {

    //////////////////////////////////////////////////////////
    //////////////////// LOAD GROUP STATE ////////////////////
    //////////////////////////////////////////////////////////

    // TODO: get all group (info, description, ...) here. Then distribite to components with props or state.
    const groupRes = await getGroup(parseInt(props.params.groupId));
    // const groupStatsResponse = await getGroupStats(parseInt(props.params.groupId)); // TODO: Get group stats here.
    const tanksRes = await getTanks(parseInt(props.params.groupId));

    return (
        <div className={"group"}>
            <StoreInitializer
                group={{
                    groupId: parseInt(props.params.groupId),
                    group: groupRes.data,
                    tanks: tanksRes.data,
                }}
            />
            <div className={"status"}>
                <GroupInfoWidget group={groupRes.data} />
                <GroupDescription description={groupRes.data.description} />
                <CreateTankWidget />
            </div>
            <div className={"general"}>
                <div className={"info"}>
                    <InfoWidget title='Inflow' data={[5, 25, 87, 74]} color="#3de198" timeframe="h" unit="L" />
                    <InfoWidget title='Outflow' data={[5, 25, 87, 74]} color='#e07159' timeframe="h" unit="L" />
                    <InfoWidget title='Savings' data={[5, 25, 87, 74]} color='#f2c986' timeframe="h" unit="L" />
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