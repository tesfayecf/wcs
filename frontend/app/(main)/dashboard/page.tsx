import React from "react";

import SummaryWidget from "@/app/(main)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(main)/dashboard/components/WeatherWidget/WeatherWidget";

import GroupsInfo from "@/app/(main)/dashboard/components/GroupsInfo/GroupsInfo";

import GroupPopUp from "@/app/(main)/dashboard/components/GroupPopUp/GroupPopUp";

import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import { getCurrentWeather, getForecastWeather, getGroups, getSummary } from "@/app/(main)/dashboard/actions";
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
      <div className={"status"}>
        <SummaryWidget />
        <WeatherWidget current={currentWeatherRes.data} forecast={forecastWeatherRes.data} />
      </div>
      <div className={"info"}>
        <InfoWidget title='Inflow' data={summaryRes.data.inflow} color='#3de198' unit="L" timeframe="d" />
        <InfoWidget title='Outflow' data={summaryRes.data.outflow} color='#e07159' unit="L" timeframe="d" />
        <InfoWidget title='Savings' data={summaryRes.data.savings} color='#f2c986' unit="€" timeframe="d" />
      </div>
      <GroupsInfo groups={groupsRes.data} />
      <GroupPopUp />
    </div >
  )
}

export default Dashboard;