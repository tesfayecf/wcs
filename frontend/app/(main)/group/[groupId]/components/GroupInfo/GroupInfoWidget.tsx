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
                    <div className={"name"}>
                        {groupInfo.name}
                    </div>
                </div>
                <div className={"level"}>
                    <div className={"percentage"}>
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
                            <DataListElement keyName="Capacity" value={0} />
                            <DataListElement keyName="Nº tanks" value={0} />
                            <DataListElement keyName="Avg. level" value={0} />
                            <DataListElement keyName="Min. level" value={0} />
                            <DataListElement keyName="Max. level" value={0} />
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