import React from "react";

import SummaryWidget from "@/app/(app)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(app)/dashboard/components/WeatherWidget/WeatherWidget";

import GroupsInfo from "@/app/(app)/dashboard/components/GroupsInfo/GroupsInfo";

import GroupPopUp from "@/app/(app)/dashboard/components/GroupPopUp/GroupPopUp";

import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import { getCurrentWeather, getForecastWeather, getGroups, getSummary } from "@/app/(app)/dashboard/actions";
import InfoWidget from "@/app/components/infoWidget/InfoWidget";

interface IDashboardProps { }

const Dashboard: React.FunctionComponent<IDashboardProps> = async (props: IDashboardProps) => {

  //////////////////////////////////////////////////////////
  ////////////////// LOAD DASHBOARD STATE //////////////////
  //////////////////////////////////////////////////////////

  const [
    groupsRes,
    summaryRes,
    currentWeatherRes,
    forecastWeatherRes
  ] = await Promise.all([
    getGroups(),
    getSummary(),
    getCurrentWeather(),
    getForecastWeather()
  ]);

  return (
    <div className={"dashboard"}>
      <StoreInitializer
        dashboard={
          {
            groups: groupsRes.data,
            summary: summaryRes.data,
            currentWeather: currentWeatherRes.data,
            forecastWeather: forecastWeatherRes.data
          }
        }
      />
      <div className={"info"}>
        <InfoWidget title='Inflow' data={[]} color='#3de198' unit="L" timeframe="d" />
        <InfoWidget title='Outflow' data={[]} color='#e07159' unit="L" timeframe="d" />
        <InfoWidget title='Savings' data={[]} color='#f2c986' unit="€" timeframe="d" />
      </div>
      <div className={"status"}>
        <SummaryWidget summary={summaryRes.data} />
      </div>
      <div>
        <GroupsInfo groups={groupsRes.data} />
        <GroupPopUp />
      </div>
      <div>
        <WeatherWidget current={currentWeatherRes.data} forecast={forecastWeatherRes.data} />
      </div>
    </div >
  )
}

export default Dashboard;