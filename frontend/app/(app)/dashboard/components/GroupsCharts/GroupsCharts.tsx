'use client'
import React from "react";
import GroupsAreaChart from "./GroupsAreaChart";
import GroupsPieChart from "./GroupsPieChart";

interface IGroupsChartsProps { }

const GroupsCharts: React.FunctionComponent<IGroupsChartsProps> = React.memo(() => {
    return (
        <div id="groups-charts" className="groups-charts">
            <GroupsAreaChart />
            <GroupsPieChart />
        </div >
    );
});

export default GroupsCharts;