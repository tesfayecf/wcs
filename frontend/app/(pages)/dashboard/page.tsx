'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";

import styles from "./styles/Dashboard.module.scss"

import SummaryWidget from "@/app/(pages)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(pages)/dashboard/components/WeatherWidget/WeatherWidget";
import TankGroupWidget from "@/app/(pages)/dashboard/components/TankGroupWidget/TankGroupWidget";
import AddTankGroupWidget from "@/app/(pages)/dashboard/components/AddTankGroupWidget/AddTankGroupWidget";
import AddTankGroupPopUp from "@/app/(pages)/dashboard/components/AddTankGroupWidget/AddTankGroupPopUp";

import { ITankGroup } from "./DashboardTypes";

const dashboarHandler = DashboardHandler.getInstance();

interface IDashboardProps extends ReturnType<typeof mapStateToProps> { }

const Dashboard: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

  React.useEffect(() => {
    dashboarHandler.load();
    return () => {
      dashboarHandler.unload();
    }
  }, [])

  const renderTanksInfo = React.useCallback((tankGroups: ITankGroup[]) => {
    return tankGroups.map((tankInfo: ITankGroup, index: number) =>
      <TankGroupWidget tankGroup={tankInfo} key={index} />
    );
  }, [props.tankGroups])

  return (
    <div id="dashboard" className={styles.dashboard}>
      <div id="dashboardInfo" className={styles.info}>
        <SummaryWidget />
        <WeatherWidget />
      </div>
      <div id="dashboardTanks" className={styles.tankGroups}>
        {renderTanksInfo(props.tankGroups)}
        <AddTankGroupWidget />
      </div>
      <AddTankGroupPopUp />
    </div>
  )
}


const mapStateToProps = (state: IRootState) => {
  return {
    tankGroups: state.dashboard.tankGroups,
  }
}

export default connect(mapStateToProps, {})(Dashboard);