'use client'
import React from "react";
import GroupHandler from "./GroupHandler";
import TanksInfo from "./components/TanksInfo/TanksInfo";
import TankPopUp from "./components/TankPupUp/TankPopUp";
import GroupInfoWidget from "@/app/(pages)/group/[groupId]/components/GroupInfo/GroupInfoWidget";
import GroupDescription from "@/app/(pages)/group/[groupId]/components/GroupInfo/GroupDescription";
import InfoWidget from "@/app/(pages)/group/[groupId]/components/InfoWidget/InfoWidget";
import { ChartData } from "chart.js";
import DataWidget from "./components/DataWidget/DataWidget";

const groupHandler = GroupHandler.getInstance();

interface IDashboardProps {
    params: {
        groupId: string
    }
}

const Group: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

    React.useEffect(() => {
        groupHandler.load(props.params);
        return () => {
            groupHandler.unload();
        }
    }, [])

    return (
        <div className={"group"}>
            <div className={"status"}>
                <GroupInfoWidget />
                <GroupDescription />
            </div>
            <div className={"general"}>
                <div className={"info"}>
                    <InfoWidget title='Inflow' value={241.24} changeValue={23} data={data1} color='#3de198' />
                    <InfoWidget title='Outflow' value={872.27} changeValue={-5} data={data2} color='#e07159' />
                    <InfoWidget title='Savings' value={35} changeValue={5} data={data3} color='#f2c986' />
                </div>
                <div className={"tanks"}>
                    <TanksInfo />
                </div>
                <div className={"data"}>
                    <DataWidget />
                </div>
            </div>
            <TankPopUp />
        </div>
    )
}

export default Group;

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