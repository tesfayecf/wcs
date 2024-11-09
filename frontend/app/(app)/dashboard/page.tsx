import React from "react";
import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import { getCurrentWeather, getForecastWeather, getGroups } from "@/app/(app)/dashboard/actions";
import GroupsPanel from "@/app/(app)/dashboard/components/GroupsPanel/GroupsPanel";
import GroupsCharts from "@/app/(app)/dashboard/components/GroupsCharts/GroupsCharts";
import GroupMenu from "./components/GroupMenu/GroupMenu";

interface IDashboardProps { }

const Dashboard: React.FunctionComponent<IDashboardProps> = async (props: IDashboardProps) => {

    //////////////////////////////////////////////////////////
    ////////////////// LOAD DASHBOARD STATE //////////////////
    //////////////////////////////////////////////////////////

    /// Groups \\\
    const groupsResponse = await getGroups();

    /// Weather \\\
    const currentWeatherResponse = await getCurrentWeather();
    const forecastWeatherResponse = await getForecastWeather();

    //////////////////////////////////////////////////////////

    return (
        <div className={"dashboard"}>
            {/* ////////////////////////////////////////////////////////// */}
            <StoreInitializer
                dashboard={{
                    // Group
                    groups: groupsResponse.data,
                    groupMenu: { id: -1, mode: "info", show: false },
                    // Weather
                    currentWeather: currentWeatherResponse.data,
                    forecastWeather: forecastWeatherResponse.data
                }}
            />
            {/* ////////////////////////////////////////////////////////// */}

            <GroupsPanel groups={groupsResponse.data} />
            <GroupsCharts />
            <GroupMenu />
        </div >
    )
}

export default Dashboard;