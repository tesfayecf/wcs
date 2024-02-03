'use client'
import React from 'react';
import Link from 'next/link';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { IGroup } from '../../DashboardTypes';

type IGroupWidgetProps = {
    group: IGroup,
    color: string
}

const GroupWidget: React.FunctionComponent<IGroupWidgetProps> = (props: IGroupWidgetProps) => {

    return (
        <ContentBox customBoxClass={"group"}>
            <Link href={`/group/${props.group.id}`} style={{ textDecoration: 'none' }}>
                <div className={"groupContent"}>
                    <div className={"groupBanner"} style={{ background: props.color }} />
                    <div className={"groupInfo"}>
                        <div className={"groupName"}>{props.group.name}</div>
                        <div className={"groupLocation"}>{props.group.location}</div>
                    </div>
                </div>
            </Link >
        </ContentBox>

    )
}

export default GroupWidget;