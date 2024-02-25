'use client'
import React from 'react';
import ConnectedIcon from '@/public/svg/ConnectedIcon';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { ITank, ITankStatus } from '@/app/(main)/group/[groupId]/GroupTypes';

interface ITankWidgetWidgetProps {
    tank: ITank,
}

const TankWidget: React.FunctionComponent<ITankWidgetWidgetProps> = (props: ITankWidgetWidgetProps) => {
    const getStatus = () => {
        let text: ITankStatus = "Undefined";
        let icon = null;
        let color: string = "#f69c68";

        // const sensor = props.sensors.find(s => s.tank.id === props.tank.id);
        // if (sensor) {
        //     text = sensor.is_active ? "Connected" : "Disconnected"
        //     color = sensor.is_active ? "#3de198" : "#e07159"
        //     icon = sensor.is_active ? <ConnectedIcon size={30} fill={color} strokeWidth={1} /> : null
        // }

        return (
            <p style={{ color: color }}>{icon} {text}</p>
        )
    }

    const getSensorValue = () => {
        // const sensor = props.sensors.find(s => s.tank.id === props.tank.id)
        // if (!sensor) return ""
        // const sensorData = props.sensorsData[sensor.id]
        // if (!sensorData) return ""
        return null
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
                </div>
                <div className={"tankData"}>
                    <div className={"level"}>
                        {getSensorValue()}
                    </div>
                    <div className={"status"}>
                        {getStatus()}
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


const waterAnimation = () => {
    return (
        <span className={"main"}>

        </span>
    )
}