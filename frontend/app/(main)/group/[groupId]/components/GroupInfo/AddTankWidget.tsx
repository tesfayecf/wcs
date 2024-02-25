'use client'
import React from 'react';
import ContentBox from '@/app/components/contentBox/ContentBox';
import useGroupStore from '@/app/(main)/group/[groupId]/store';

interface IAddTankWidgetWidgetProps { }

const AddTankWidget: React.FunctionComponent<IAddTankWidgetWidgetProps> = (props: IAddTankWidgetWidgetProps) => {
    const setShowTankMenu = useGroupStore((state) => state.setShowTankMenu)

    return (
        <ContentBox customBoxClass={"groupAddTank"}>
            <div className={"addTankContent"}>
                <div className={"text"} onClick={() => setShowTankMenu(true)}>
                    Add new tank
                </div>
            </div>
        </ContentBox >
    )
}

export default AddTankWidget;