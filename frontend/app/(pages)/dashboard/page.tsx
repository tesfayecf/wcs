'use client'
import React from "react";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";

import SummaryWidget from "@/app/(pages)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(pages)/dashboard/components/WeatherWidget/WeatherWidget";
import GroupPopUp from "@/app/(pages)/dashboard/components/GroupPopUp/GroupPopUp";

import ToolsBar from "@/app/components/toolsBar/ToolsBar";
import GroupsInfo from "@/app/(pages)/dashboard/components/GroupsInfo/GroupsInfo";

interface IDashboardProps { }

const dashboarHandler = DashboardHandler.getInstance();

const Dashboard: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

  React.useEffect(() => {

    dashboarHandler.load();
    return () => {
      dashboarHandler.unload();
    }
  }, [])


  return (
    <div id="dashboard" className={"dashboard"}>
      <div id="dashboardInfo" className={"info"}>
        <SummaryWidget />
        <WeatherWidget />
      </div>
      <div id="dashboardTools" className={"tools"}>
        <ToolsBar onCreate={() => dashboarHandler.setShowGroupMenu(true)} />
      </div>
      <div id="dashboardGroups" className={"groups"}>
        <GroupsInfo />
      </div>
      <GroupPopUp />
    </div >
  )
}

export default Dashboard;