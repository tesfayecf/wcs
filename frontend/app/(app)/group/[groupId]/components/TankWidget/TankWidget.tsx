'use client'
import React from 'react';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { Tank } from "@/app/(app)/group/[groupId]/tank/[tankId]/types";

interface ITankWidgetWidgetProps {
    tank: Tank.ITank,
}

const TankWidget: React.FunctionComponent<ITankWidgetWidgetProps> = async (props: ITankWidgetWidgetProps) => {

    const getSensorStatus = () => {
        let text: Tank.ITankStatus = "Undefined";
        let icon = null;
        let color: string = "#f69c68";

        return (
            <p style={{ color: color }}>{icon} {text}</p>
        )
    }

    const getSensorReading = async () => {
        return Math.round(Math.random() * 100)
    }

    return (
        <ContentBox customBoxClass={"tankWidget"}>
            {/* <Link href={`/tank/${props.tank.id}`} style={{ textDecoration: 'none' }}> */}
            <div className={"tankContent"}>
                <div className={"tankHeader"}>
                    <div className={"name"}>
                        {props.tank.name}
                    </div>
                    <div className={"type"}>
                        {props.tank.type}
                    </div>
                    <div className={"tankStatus"}>
                        {getSensorStatus()}
                    </div>
                </div>
                <div className={"tankData"}>
                    <div className={"level"}>
                        {getSensorReading()}%
                    </div>
                </div>
            </div>
            {/* </Link> */}
        </ContentBox >

    )
}


export default TankWidget;


interface IDataListElementProps {
    keyName: string;
    value: string | number | boolean;
}

const DataListElement: React.FunctionComponent<IDataListElementProps> = (props: IDataListElementProps) => {
    return (
        <div className={"element"}>
            <span className={"key"}> {props.keyName} </span>
            <span className={"value"}>{props.value}</span>
        </div>
    )

}