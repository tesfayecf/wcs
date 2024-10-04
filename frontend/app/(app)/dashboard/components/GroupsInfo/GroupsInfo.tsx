'use client'
import React from "react";
import GroupWidget from "@/app/(app)/dashboard/components/GroupWidget/GroupWidget";
import { IGroup } from "@/app/(app)/dashboard/types";
import ContentBox from "@/app/components/contentBox/ContentBox";
import useDashboardStore from "@/app/(app)/dashboard/store";

const COLORS = ['#83ecbd', '#e68b77', '#f2c986', '#92c594', '#12f594'];
interface IGroupsInfoProps {
    groups: IGroup[];
}

const GroupsInfo: React.FunctionComponent<IGroupsInfoProps> = (props: IGroupsInfoProps) => {
    const setGroupMenu = useDashboardStore((state) => state.setGroupMenu);

    const renderGroupsInfo = React.useCallback((groups: IGroup[]) => {
        if (!groups || groups.length === 0) {
            return <div>No groups available</div>;
        }

        const widgets = groups.map((group: IGroup, index: number) => (
            <GroupWidget group={group} key={group.id} color={COLORS[index % COLORS.length]} />
        ));

        widgets.push(
            <CreateGroupWidget
                key="create-group"
                onCreate={() => setGroupMenu({ show: true, id: -1, mode: "create" })}
            />
        );
        return widgets;
    }, [setGroupMenu, COLORS]);

    return (
        <div className="groups">
            {renderGroupsInfo(props.groups)}
        </div>
    );
};

export default GroupsInfo;

interface IAddGroupWidgetProps {
    onCreate: () => void;
}

const CreateGroupWidget: React.FunctionComponent<IAddGroupWidgetProps> = ({ onCreate }) => {
    return (
        <ContentBox customBoxClass={"groupWidget"}>
            <div className={"addGroupContent"} onClick={onCreate}>
                CREATE GROUP
            </div>
        </ContentBox>
    );
};
