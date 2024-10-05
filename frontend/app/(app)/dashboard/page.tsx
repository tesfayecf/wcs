import React from "react";
import { getCurrentWeather, getForecastWeather, getGroups, getSummary } from "@/app/(app)/dashboard/actions";
import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import SummaryWidget from "@/app/(app)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(app)/dashboard/components/WeatherWidget/WeatherWidget";
import GroupsInfo from "@/app/(app)/dashboard/components/GroupsInfo/GroupsInfo";
import GroupPopUp from "@/app/(app)/dashboard/components/GroupPopUp/GroupPopUp";
import InfoWidget from "@/app/components/infoWidget/InfoWidget";
import GroupsPanel from "./components/GroupsPanel/GroupsPanel";
import GroupsCharts from "./components/GroupsCharts/GroupsCharts";

interface IDashboardProps { }

const Dashboard: React.FunctionComponent<IDashboardProps> = async (props: IDashboardProps) => {

    //////////////////////////////////////////////////////////
    ////////////////// LOAD DASHBOARD STATE //////////////////
    //////////////////////////////////////////////////////////

    /// Groups \\\
    const groupsResponse = await getGroups();

    // /// Summary \\\
    // const summaryResponse = await getSummary();

    /// Stats \\\
    // const statsResponse = await getStats();

    // /// Current weather \\\
    // const currentWeatherResponse = await getCurrentWeather();

    // /// Forecast weather \\\
    // const forecastWeatherResponse = await getForecastWeather();

    //////////////////////////////////////////////////////////

    return (
        <div className={"dashboard"}>
            {/* ////////////////////////////////////////////////////////// */}
            <StoreInitializer
                dashboard={{
                    groups: groupsResponse.data,
                    // summary: summaryResponse.data,
                    // // stats: statsResponse.data,
                    // currentWeather: currentWeatherResponse.data,
                    // forecastWeather: forecastWeatherResponse.data
                }}
            />
            {/* ////////////////////////////////////////////////////////// */}

            <GroupsPanel groups={groupsResponse.data} />
            <GroupsCharts />
        </div >
    )
}

export default Dashboard;