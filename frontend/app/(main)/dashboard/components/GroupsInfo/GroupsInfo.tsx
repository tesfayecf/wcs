'use client'
import React from "react";
import GroupWidget from "@/app/(main)/dashboard/components/GroupWidget/GroupWidget";
import { IGroup } from "@/app/(main)/dashboard/types";
import ContentBox from "@/app/components/contentBox/ContentBox";
import useDashboardStore from "@/app/(main)/dashboard/store";


interface IGroupsInfoProps { }

const GroupsInfo: React.FunctionComponent<IGroupsInfoProps> = (props: IGroupsInfoProps) => {
    const groups = useDashboardStore((state) => state.groups)
    const setGroupMenu = useDashboardStore((state) => state.setGroupMenu)

    const colors = ['#83ecbd', '#e68b77', '#f2c986', '#92c594', '#12f594']

    const renderGroupsInfo = React.useCallback((groups: IGroup[]) => {
        const widgets = groups.map((tankInfo: IGroup, index: number) =>
            <GroupWidget group={tankInfo} key={index} color={colors[index]} />
        );

        widgets.push(<AddGroupWidget onCreate={() => setGroupMenu({ show: true, id: -1, mode: "create" })} />)
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
