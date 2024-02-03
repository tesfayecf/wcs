'use client'
import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import { ISensor, ITank, ITankStatus } from '../../GroupTypes';
import ContentBox from '@/app/components/contentBox/ContentBox';
import ConnectedIcon from '@/public/svg/ConnectedIcon';

interface ITankWidgetWidgetProps extends ReturnType<typeof mapStateToProps> {
    tank: ITank,
}

const TankWidget: React.FunctionComponent<ITankWidgetWidgetProps> = (props: ITankWidgetWidgetProps) => {
    const size = 125;

    const getStatus = () => {
        let text: ITankStatus = "Undefined";
        let icon = null;
        let color: string = "#f69c68";

        const hasSensor = props.tank.hasSensor;
        if (hasSensor) {
            const sensor = props.sensors.find(s => s.tank.id === props.tank.id);
            if (sensor) {
                text = sensor.is_active ? "Connected" : "Disconnected"
                color = sensor.is_active ? "#3de198" : "#e07159"
                icon = sensor.is_active ? <ConnectedIcon size={30} fill={color} strokeWidth={1} /> : null
            }
        }

        return (
            <p style={{ color: color }}>{icon} {text}</p>
        )
    }

    const getSensorValue = () => {
        const sensor = props.sensors.find(s => s.tank.id === props.tank.id)
        if (!sensor) return ""
        const sensorData = props.sensorsData[sensor.id]
        if (!sensorData) return ""
        return sensorData
    }

    return (
        <ContentBox customBoxClass={"tankWidget"}>
            <Link href={`/tank/${props.tank.id}`} style={{ textDecoration: 'none' }}>
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
            </Link>
        </ContentBox >

    )
}


function mapStateToProps(state: IRootState) {
    return {
        sensorsData: state.group.sensorsData,
        sensors: state.group.sensors,
    }
}

export default connect(mapStateToProps, {})(TankWidget)


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