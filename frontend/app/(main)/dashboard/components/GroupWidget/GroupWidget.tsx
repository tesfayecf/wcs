'use client'
import React from 'react';
import Link from 'next/link';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { IGroup } from '@/app/(main)/dashboard/types';
import useDashboardStore from '../../store';

type IGroupWidgetProps = {
    group: IGroup,
    color: string
}

const GroupWidget: React.FunctionComponent<IGroupWidgetProps> = (props: IGroupWidgetProps) => {
    const [hover, setHover] = React.useState<boolean>(false);
    const setGroupMenu = useDashboardStore(state => state.setGroupMenu)

    const onMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setHover(true);
    }

    const onMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setHover(false);
    }

    const onWishToEdit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        setGroupMenu({
            show: true,
            mode: "edit",
            id: props.group.id,
        });
    }

    const onWishToDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        setGroupMenu({
            show: true,
            mode: "delete",
            id: props.group.id,
        });
    }

    return (
        <ContentBox customBoxClass={"groupWidget"}>
            <Link href={`/group/${props.group.id}`} style={{ textDecoration: 'none' }}>
                <div className={"groupContent"} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
                    {/* <div className={"groupBanner"} style={{ background: props.color }} /> */}
                    <div className={"groupInfo"}>
                        <div className={"groupName"}>{props.group.name}</div>
                        <div className={"groupLocation"}>{props.group.location}</div>
                    </div>
                    {hover ? <div className={"groupSettings"} style={{ textDecoration: 'none' }}>
                        <div className={"edit"} onClick={onWishToEdit}>Edit</div>
                        <div className={"delete"} onClick={onWishToDelete}>Delete</div>
                    </div> : null}
                </div>
            </Link >
        </ContentBox >

    )
}

export default GroupWidget;