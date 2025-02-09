"use client";
import React from "react";
import GroupMenu from "@/app/(app)/dashboard/components/GroupMenu/GroupMenu"; 
import GroupsPanel from "@/app/(app)/dashboard/components/GroupsPanel/GroupsPanel";
import GroupsCharts from "@/app/(app)/dashboard/components/GroupsCharts/GroupsCharts";

interface IDashboardClientProps { };

const DashboardClient: React.FunctionComponent<IDashboardClientProps> = (props: IDashboardClientProps) => {
    return (
        <>
            <GroupsPanel />
            <GroupsCharts />
            <GroupMenu />
        </>
    )
}

export default DashboardClient