import React, { Suspense } from "react";

import SummaryWidget from "@/app/(main)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(main)/dashboard/components/WeatherWidget/WeatherWidget";

import GroupsInfo from "@/app/(main)/dashboard/components/GroupsInfo/GroupsInfo";
import InfoWidget from "./components/InfoWidget/InfoWidget";

import GroupPopUp from "@/app/(main)/dashboard/components/GroupPopUp/GroupPopUp";
import { StoreInitializer } from "@/app/lib/store/StoreInitializer";
import { getGroups, getSummary } from "./actions";

interface IDashboardProps { }

const Dashboard: React.FunctionComponent<IDashboardProps> = async (props: IDashboardProps) => {

  //////////////////////////////////////////////////////////
  ////////////////// LOAD DASHBOARD STATE //////////////////
  //////////////////////////////////////////////////////////

  const groupsResponse = await getGroups();
  const summaryResponse = await getSummary();
  // Get groups stats
  // Get groups summary

  return (
    <div className={"dashboard"}>
      <StoreInitializer
        dashboard={
          {
            groups: groupsResponse.data,
            summary: summaryResponse.data
          }
        }
      />
      <div className={"status"}>
        <SummaryWidget />
        <WeatherWidget />
      </div>
      <div className={"info"}>
        <InfoWidget title='Inflow' value={15.24} changeValue={23} color='#3de198' />
        <InfoWidget title='Outflow' value={36.27} changeValue={-5} color='#e07159' />
        <InfoWidget title='Savings' value={35} changeValue={5} color='#f2c986' />
      </div>
      <div className={"groups"}>
        <GroupsInfo />
      </div>
      <GroupPopUp />
    </div >
  )
}

export default Dashboard;