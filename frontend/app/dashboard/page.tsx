import React from "react";
import SummaryWidget from "./components/SummaryWidget/SummaryWidget";

type IDasboardProps = {}

const Dashboard: React.FunctionComponent<IDasboardProps> = (props: IDasboardProps) => {
    return (
        <div id="dashboard-wrapper">
            <SummaryWidget/>
        </div >
    )
}

export default Dashboard;

/*
import React, { useEffect, useRef, useState } from 'react';

import { ContentBox, WaterTankWidget, WaterTankAddButton, WeatherWidget, SummaryWidget, Button, WaterTankAddDialog } from '../components';
import { useStateContext } from '../contexts/ContextProvider';



import '../components/styles.css'

// const DropDown = ({ currentMode }) => (
//   <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
//     <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
//   </div>
// );

const Dashboard = () => {

  const [showDialog, setShowDialog] = React.useState(false);

  const waterTankWidgets = waterTanksInfo.tanks.map((tankInfo) =>
    <ContentBox >
      <WaterTankWidget tankInfo={tankInfo} />
    </ContentBox>
  );

  const WaterTankAddButtonWidget = () => {
    return (
      <ContentBox>
        <WaterTankAddButton onclick={onAddButtonClicked} />
      </ContentBox>
    )
  }

  waterTankWidgets.push(<WaterTankAddButtonWidget />)

  const onAddButtonClicked = () => {
    setShowDialog(true);
  }

  const handleAddWatertank = () => {
    // chech all variables are valid
    // requestHanlder add watertank
    handleClose();
  }

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <>
      <div className="dashboard-main-container">
        <div className="dashboard-info-container">
          <div className="summary-data-content-box">
            <SummaryWidget />
          </div>
          <div className="weather-data-content-box">
            <WeatherWidget />
          </div>
        </div>
        <div className="dashboard-tanks-container">
          {waterTankWidgets}
        </div>
      </div>
      <WaterTankAddDialog open={showDialog} onClose={handleClose} onAddWaterTank={handleAddWatertank}/>
    </>
  );
};

export default Dashboard;

const waterTanksInfo = {
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
    {
      id: 3,
      name: 'Garden Tank',
      type: 'transport',
      capacity: 250,
      dimensions: "50x30x50",
      brand: 'ABC',
      material: 'carbon steel',
      status: true,
    },
    {
      id: 4,
      name: 'Balcony Tank',
      type: 'storage',
      brand: 'Smith',
      capacity: 750,
      material: 'titanium',
      status: true,
    },
    {
      id: 5,
      name: 'Terrace Tank',
      type: 'processing',
      brand: 'Johnson',
      capacity: 1500,
      material: 'copper',
      status: false,
    },
    // {
    //   id: 6,
    //   name: 'Porch Tank',
    //   type: 'transport',
    //   brand: 'Williams',
    //   capacity: 400,
    //   material: 'brass',
    //   status: true,
    // },
    // {
    //   id: 7,
    //   name: 'Lawn Tank',
    //   type: 'storage',
    //   brand: 'Brown',
    //   capacity: 300,
    //   material: 'plastic',
    //   status: true,
    // },
    // {
    //   id: 8,
    //   name: 'Yard Tank',
    //   type: 'processing',
    //   brand: 'Davis',
    //   capacity: 800,
    //   material: 'bronze',
    //   status: true,
    // },
    // {
    //   id: 9,
    //   name: 'Veranda Tank',
    //   type: 'transport',
    //   brand: 'Miller',
    //   capacity: 200,
    //   material: 'steel',
    //   status: true,
    // },
    // {
    //   id: 10,
    //   name: 'Roof Tank',
    //   type: 'storage',
    //   brand: 'Wilson',
    //   capacity: 450,
    //   material: 'aluminum',
    //   status: true,
    // }
  ]
}

*/