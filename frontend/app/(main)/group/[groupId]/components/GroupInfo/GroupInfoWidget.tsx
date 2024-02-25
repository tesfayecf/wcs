'use client'
import React from 'react';
import ContentBox from '@/app/components/contentBox/ContentBox';
import useGroupStore from '@/app/(main)/group/[groupId]/store';

interface IGroupWidgetProps { }


const GroupInfoWidget: React.FunctionComponent<IGroupWidgetProps> = (props: IGroupWidgetProps) => {
    const groupInfo = useGroupStore((state) => state.groupInfo)

    return (
        <ContentBox customBoxClass={"groupInfo"}>
            <div className={"groupInfoContent"}>
                <div className={"groupHeader"}>
                    <div className={"groupInfoName"}>
                        {groupInfo.name}
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
                            <DataListElement keyName="Location" value={groupInfo.location} />
                            {/* <DataListElement keyName="Capacity" value={props.groupStats.totalCapacity} />
                            <DataListElement keyName="Nº tanks" value={props.groupStats.totalTanks} />
                            <DataListElement keyName="Avg. level" value={props.groupStats.averageWaterLevel} />
                            <DataListElement keyName="Min. level" value={props.groupStats.minWaterLevel} />
                            <DataListElement keyName="Max. level" value={props.groupStats.maxWaterLevel} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </ContentBox>
    )
}

export default GroupInfoWidget;


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