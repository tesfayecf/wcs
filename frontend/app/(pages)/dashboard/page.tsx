'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";

import SummaryWidget from "@/app/(pages)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(pages)/dashboard/components/WeatherWidget/WeatherWidget";
import GroupWidget from "@/app/(pages)/dashboard/components/GroupWidget/GroupWidget";
import GroupPopUp from "@/app/(pages)/dashboard/components/GroupPopUp/GroupPopUp";

import { IGroup } from "./DashboardTypes";
import ToolsBar from "@/app/components/toolsBar/ToolsBar";

const dashboarHandler = DashboardHandler.getInstance();

interface IDashboardProps extends ReturnType<typeof mapStateToProps> { }

const Dashboard: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

  React.useEffect(() => {
    dashboarHandler.load();
    return () => {
      dashboarHandler.unload();
    }
  }, [])

  const renderGroupsInfo = React.useCallback((tankGroups: IGroup[]) => {
    return tankGroups.map((tankInfo: IGroup, index: number) =>
      <GroupWidget group={tankInfo} key={index} />
    );
  }, [props.tankGroups])

  return (
    <div id="dashboard" className={"dashboard"}>
      <div id="dashboardInfo" className={"info"}>
        <SummaryWidget />
        <WeatherWidget />
      </div>
      <div id="dashboardTools" className={"tools"}>
        <ToolsBar onCreate={() => dashboarHandler.setShowCreateTankGroupMenu(true)} />
      </div>
      <div id="dashboardTanks" className={"tankGroups"}>
        {renderGroupsInfo(props.tankGroups)}
      </div>
      <GroupPopUp />
    </div >
  )
}


const mapStateToProps = (state: IRootState) => {
  return {
    tankGroups: state.dashboard.tankGroups,
  }
}

export default connect(mapStateToProps, {})(Dashboard);