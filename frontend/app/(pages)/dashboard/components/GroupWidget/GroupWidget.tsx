'use client'
import React from 'react';
import Link from 'next/link';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { IGroup } from '../../DashboardTypes';

type IGroupWidgetProps = {
    group: IGroup
}

const GroupWidget: React.FunctionComponent<IGroupWidgetProps> = (props: IGroupWidgetProps) => {


    const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        console.log("Button clicked");
        event.stopPropagation();
    };

    return (
        <ContentBox customBoxClass={"group"}>
            <Link href={`/group/${props.group.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                <div className={"groupContent"}>
                    <div className={"groupBanner"} />
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