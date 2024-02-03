'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";
import GroupWidget from "@/app/(pages)/dashboard/components/GroupWidget/GroupWidget";
import { IGroup } from "@/app/(pages)/dashboard/DashboardTypes";

const dashboarHandler = DashboardHandler.getInstance();

interface IGroupsInfoProps extends ReturnType<typeof mapStateToProps> { }

const GroupsInfo: React.FunctionComponent<IGroupsInfoProps> = (props: IGroupsInfoProps) => {

    const colors = ['#83ecbd', '#e68b77', '#f2c986', '#92c594', '#12f594']

    const renderGroupsInfo = React.useCallback((groups: IGroup[]) => {
        const widgets = groups.map((tankInfo: IGroup, index: number) =>
            <GroupWidget group={tankInfo} key={index} color={colors[index]} />
        );

        return widgets
    }, [props.groups])

    return renderGroupsInfo(props.groups)
}

const mapStateToProps = (state: IRootState) => {
    return {
        groups: state.dashboard.groups,
    }
}

export default connect(mapStateToProps, {})(GroupsInfo);