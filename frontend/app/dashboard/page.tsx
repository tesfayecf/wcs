import React from "react";
import styles from "./styles/Dashboard.module.scss"
import DashboardHandler from "./DashboardHandler";
import contentBoxStyles from "./../components/contentBox/styles/ContentBox.module.scss"
import SummaryWidget from "./components/SummaryWidget/SummaryWidget";
import WeatherWidget from "./components/WeatherWidget/WeatherWidget";
import ContentBox from "../components/contentBox/ContentBox";
import WaterTankWidget from "./components/WaterTankWidget/WaterTankWidget";
import WaterTankAddButton from "./components/WaterTankWidget/AddWaterTankWidget";
import AddWaterTankPopUp from "./components/WaterTankWidget/AddWaterTankPopUp";

const dashboarHandler = DashboardHandler.getInstance();

type IDashboardProps = {}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

  return (
    <div className={styles.dashboard_main}>
      <div className={styles.dashboard_main_info}>
        <div className={contentBoxStyles.content_box_summary}>
          <SummaryWidget />
        </div>
        <div className={contentBoxStyles.content_box_weather}>
          <WeatherWidget />
        </div>
      </div>
      <div className={styles.dashboard_main_tanks}>
        {renderTanksInfo(waterTanksInfo)}
        <ContentBox>
          <WaterTankAddButton />
        </ContentBox>
      </div>
      <AddWaterTankPopUp />
    </div>
  )
}

export default Dashboard;


const renderTanksInfo = (waterTanksInfo: any) => {

  return waterTanksInfo.tanks.map((tankInfo: any, index: number) =>
    <ContentBox key={index}>
      <WaterTankWidget
        id={tankInfo.id}
        name={tankInfo.name}
        brand={tankInfo.brand}
        capacity={tankInfo.capacity}
        dimensions={tankInfo.dimensions}
        material={tankInfo.material}
        status={tankInfo.status}
        type={tankInfo.type}
        key={tankInfo?.key}
      />
    </ContentBox>
  );
}




const waterTanksInfo: any = {
  tanks: [
    {
      id: 1,
      name: 'Patio Tank',
      type: 'storage',
      capacity: 500,
      dimensions: "240x200x100",
      brand: 'Acme',
      material: 'stainless steel',
      status: false,
    },
    {
      id: 2,
      name: 'Deck Tank',
      type: 'processing',
      capacity: 1000,
      dimensions: "120x100x100",
      brand: 'XYZ',
      material: 'aluminum',
      status: true,
    },
  ]
}