'use client'
import React from "react";
import { ChartData } from "chart.js";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";

import SummaryWidget from "@/app/(pages)/dashboard/components/SummaryWidget/SummaryWidget"
import WeatherWidget from "@/app/(pages)/dashboard/components/WeatherWidget/WeatherWidget";
import GroupPopUp from "@/app/(pages)/dashboard/components/GroupPopUp/GroupPopUp";

import GroupsInfo from "@/app/(pages)/dashboard/components/GroupsInfo/GroupsInfo";
import InfoWidget from "./components/InfoWidget/InfoWidget";

interface IDashboardProps { }

const dashboarHandler = DashboardHandler.getInstance();

const Dashboard: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  React.useEffect(() => {
    dashboarHandler.load();
    return () => {
      dashboarHandler.unload();
    }
  }, [])

  const onCreate = React.useCallback(() => {
    dashboarHandler.setShowGroupMenu(true)
  }, [])


  return (
    <div className={"dashboard"}>
      <div className={"status"}>
        <SummaryWidget />
        <WeatherWidget />
      </div>
      <div className={"info"}>
        <InfoWidget title='Inflow' value={241.24} changeValue={23} data={data1} color='#3de198' />
        <InfoWidget title='Outflow' value={872.27} changeValue={-5} data={data2} color='#e07159' />
        <InfoWidget title='Savings' value={35} changeValue={5} data={data3} color='#f2c986' />
      </div>
      <div className={"groups"}>
        <GroupsInfo />
      </div>
      <GroupPopUp />
    </div >
  )
}

export default Dashboard;


// Define the labels
const labels = [
  "1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d",
  "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"
];

const data1: ChartData<'line'> = {
  labels: labels,
  datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

const data2: ChartData<'line'> = {
  labels: labels,
  datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

const data3: ChartData<'line'> = {
  labels: labels,
  datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

function generateRandomData(min, max, length) {
  const data = [];
  for (let i = 0; i < length; i++) {
    const randomValue = Math.random() * (max - min) + min;
    data.push(randomValue.toFixed(2)); // Round to 2 decimal places
  }
  return data;
}