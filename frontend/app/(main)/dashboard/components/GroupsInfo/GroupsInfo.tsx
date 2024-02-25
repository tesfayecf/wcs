'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/lib/store/store";
import DashboardHandler from "@/app/(main)/dashboard/DashboardHandler";
import GroupWidget from "@/app/(main)/dashboard/components/GroupWidget/GroupWidget";
import { IGroup } from "@/app/(main)/dashboard/DashboardTypes";
import ContentBox from "@/app/components/contentBox/ContentBox";
import useDashboardStore from "@/app/lib/store/dashboardStore";

const dashboarHandler = DashboardHandler.getInstance();

interface IGroupsInfoProps { }

const GroupsInfo: React.FunctionComponent<IGroupsInfoProps> = (props: IGroupsInfoProps) => {
    const groups = useDashboardStore((state) => state.groups)
    const setShowCreateGroupMenu = useDashboardStore((state) => state.setShowGroupMenu)

    const colors = ['#83ecbd', '#e68b77', '#f2c986', '#92c594', '#12f594']

    const renderGroupsInfo = React.useCallback((groups: IGroup[]) => {
        const widgets = groups.map((tankInfo: IGroup, index: number) =>
            <GroupWidget group={tankInfo} key={index} color={colors[index]} />
        );

        widgets.push(<AddGroupWidget onCreate={() => setShowCreateGroupMenu(true)} />)

        return widgets
    }, [groups])

    return renderGroupsInfo(groups)
}

export default GroupsInfo;

interface IAddGroupWidgetProps {
    onCreate: () => void;
}

const AddGroupWidget: React.FunctionComponent<IAddGroupWidgetProps> = (props: IAddGroupWidgetProps) => {
    return (
        <ContentBox customBoxClass={"groupWidget"}>
            <div className={"addGroupContent"} onClick={props.onCreate}>
                ADD NEW GROUP
            </div>
        </ContentBox>
    )
}
