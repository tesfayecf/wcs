'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import ContentBox from '@/app/components/contentBox/ContentBox';

import GroupHandler from '@/app/(main)/group/[groupId]/GroupHandler';

const groupHandler = GroupHandler.getInstance();

interface IAddTankWidgetWidgetProps extends ReturnType<typeof mapStateToProps> { }

const AddTankWidget: React.FunctionComponent<IAddTankWidgetWidgetProps> = (props: IAddTankWidgetWidgetProps) => {

    const onClick = () => {
        groupHandler.setShowTankMenu(true)
    }

    return (
        <ContentBox customBoxClass={"groupAddTank"}>
            <div className={"addTankContent"}>
                <div className={"text"} onClick={onClick}>
                    Add new tank
                </div>
            </div>
        </ContentBox >
    )
}

function mapStateToProps(state: IRootState) {
    return {}
}

export default connect(mapStateToProps, {})(AddTankWidget)