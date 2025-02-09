export const dynamic = "force-dynamic";
import React from "react";
import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import { getCurrentWeather, getForecastWeather, getGroups } from "@/app/(app)/dashboard/actions";
import DashboardClient from "@/app/(app)/dashboard/client";

interface IDashboardProps { };

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
                    groups: groupsResponse ? groupsResponse.data : [],
                    groupMenu: { id: -1, mode: "info", show: false },
                    // Weather
                    currentWeather: currentWeatherResponse.data,
                    forecastWeather: forecastWeatherResponse.data
                }}
            />
            {/* ////////////////////////////////////////////////////////// */}

            <DashboardClient />
        </div >
    )
}

export default Dashboard;