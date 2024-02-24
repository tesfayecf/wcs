'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import DashboardHandler from "@/app/(main)/dashboard/DashboardHandler";
import GroupWidget from "@/app/(main)/dashboard/components/GroupWidget/GroupWidget";
import { IGroup } from "@/app/(main)/dashboard/DashboardTypes";
import ContentBox from "@/app/components/contentBox/ContentBox";

const dashboarHandler = DashboardHandler.getInstance();

interface IGroupsInfoProps extends ReturnType<typeof mapStateToProps> { }

const GroupsInfo: React.FunctionComponent<IGroupsInfoProps> = (props: IGroupsInfoProps) => {

    const colors = ['#83ecbd', '#e68b77', '#f2c986', '#92c594', '#12f594']

    const onWishToCreateGroup = () => {
        dashboarHandler.setShowGroupMenu(true);
    }

    const renderGroupsInfo = React.useCallback((groups: IGroup[]) => {
        const widgets = groups.map((tankInfo: IGroup, index: number) =>
            <GroupWidget group={tankInfo} key={index} color={colors[index]} />
        );

        widgets.push(<AddGroupWidget onCreate={onWishToCreateGroup} />)

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
