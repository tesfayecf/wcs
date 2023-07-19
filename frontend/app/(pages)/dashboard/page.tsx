'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";
import contentBoxStyles from "@/app/components/contentBox/styles/ContentBox.module.scss";
import SummaryWidget from "@/app/(pages)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(pages)/dashboard/components/WeatherWidget/WeatherWidget";
import ContentBox from "@/app/components/contentBox/ContentBox";
import TankGroupWidget from "@/app/(pages)/dashboard/components/TankGroupWidget/TankGroupWidget";
import AddTankGroupPopUp from "@/app/(pages)/dashboard/components/TankGroupWidget/AddTankGroupPopUp";
import styles from "./styles/Dashboard.module.scss"
import { ITankGroup } from "./DashboardTypes";
import AddTankGroupWidget from "./components/TankGroupWidget/AddTankGroupWidget";

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
      <ContentBox key={index}>
        <TankGroupWidget tankGroup={tankInfo} key={index} />
      </ContentBox>
    );
  }, [props.tankGroups])


  return (
    <div className={styles.dashboard}>
      <div className={styles.info}>
        <div className={contentBoxStyles.content_box_summary}>
          <SummaryWidget />
        </div>
        <div className={contentBoxStyles.content_box_weather}>
          <WeatherWidget />
        </div>
      </div>
      <div className={styles.tanks}>
        {renderTanksInfo(props.tankGroups)}
        <ContentBox>
          <AddTankGroupWidget />
        </ContentBox>
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