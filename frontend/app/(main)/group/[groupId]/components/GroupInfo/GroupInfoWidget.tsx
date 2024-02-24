'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import ContentBox from '@/app/components/contentBox/ContentBox';

interface IGroupWidgetProps extends ReturnType<typeof mapStateToProps> { }


const GroupInfoWidget: React.FunctionComponent<IGroupWidgetProps> = (props: IGroupWidgetProps) => {
    return (
        <ContentBox customBoxClass={"groupInfo"}>
            <div className={"groupInfoContent"}>
                <div className={"groupHeader"}>
                    <div className={"groupInfoName"}>
                        {props.groupInfo.name}
                    </div>
                </div>
                <div className={"groupInfoLevel"}>
                    <div className={"valueP"}>
                        70 %
                    </div>
                    <div className={"value"}>
                        200 L
                    </div>
                </div>
                <div className={"groupData"}>
                    <div className={"groupProperties"}>
                        <div className={"list"}>
                            <DataListElement keyName="Location" value={props.groupInfo.location} />
                            <DataListElement keyName="Capacity" value={props.groupStats.totalCapacity} />
                            <DataListElement keyName="Nº tanks" value={props.groupStats.totalTanks} />
                            <DataListElement keyName="Avg. level" value={props.groupStats.averageWaterLevel} />
                            <DataListElement keyName="Min. level" value={props.groupStats.minWaterLevel} />
                            <DataListElement keyName="Max. level" value={props.groupStats.maxWaterLevel} />
                        </div>
                    </div>
                </div>
            </div>
        </ContentBox>
    )
}

function mapStateToProps(state: IRootState) {
    return {
        groupInfo: state.group.groupInfo,
        groupStats: state.group.groupStats
    }
}

export default connect(mapStateToProps, {})(GroupInfoWidget)



interface IDataListElementProps {
    keyName: string;
    value: string | number;
}

const DataListElement: React.FunctionComponent<IDataListElementProps> = (props: IDataListElementProps) => {
    return (
        <div className={"element"}>
            <span className={"key"}> {props.keyName} </span>
            <span className={"value"}>{props.value}</span>
        </div>
    )

}