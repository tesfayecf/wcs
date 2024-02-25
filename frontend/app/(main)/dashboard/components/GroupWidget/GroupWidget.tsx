'use client'
import React from 'react';
import Link from 'next/link';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { IGroup } from '@/app/(main)/dashboard/types';

type IGroupWidgetProps = {
    group: IGroup,
    color: string
}

const GroupWidget: React.FunctionComponent<IGroupWidgetProps> = (props: IGroupWidgetProps) => {

    const [hover, setHover] = React.useState<boolean>(false);

    const onMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setHover(true);
    }

    const onMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setHover(false);
    }

    const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("Edit group");
    }

    return (
        <ContentBox customBoxClass={"groupWidget"}>
            <Link href={`/group/${props.group.id}`} style={{ textDecoration: 'none' }}>
                <div className={"groupContent"} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
                    <div className={"groupBanner"} style={{ background: props.color }} />
                    <div className={"groupInfo"}>
                        <div className={"groupName"}>{props.group.name}</div>
                        <div className={"groupLocation"}>{props.group.location}</div>
                    </div>
                    {hover ? <div className={"groupSettings"} onClick={onClick}> settings </div> : null}
                </div>
            </Link >
        </ContentBox >

    )
}

export default GroupWidget;