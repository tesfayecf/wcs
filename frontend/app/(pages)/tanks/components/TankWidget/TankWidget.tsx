'use client'
import React from 'react';
import styles from "./styles/TankWidget.module.scss"
import { IRootState } from '@/app/utils/store/store';
import { connect } from 'react-redux';
import { ISensor, ITank, ITankStatus } from '../../TanksTypes';
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
        <ContentBox customBoxClass={styles.tank}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.name}>
                        {props.tank.name}
                    </div>
                    <div className={styles.type}>
                        {props.tank.type}
                    </div>
                </div>
                <div className={styles.data}>
                    <div className={styles.level}>
                        {getSensorValue()}
                    </div>
                    <div className={styles.status}>
                        {getStatus()}
                    </div>
                </div>

                {/* <div id='water-animation' className={styles.waterAnimation}>
                    adfjalfasf
                </div> */}
            </div>

        </ContentBox >

    )
}


function mapStateToProps(state: IRootState) {
    return {
        sensorsData: state.tanks.sensorsData,
        sensors: state.tanks.sensors,
    }
}

export default connect(mapStateToProps, {})(TankWidget)


interface IDataListElementProps {
    keyName: string;
    value: string | number | boolean;
}

const DataListElement: React.FunctionComponent<IDataListElementProps> = (props: IDataListElementProps) => {
    return (
        <div className={styles.element}>
            <span className={styles.key}> {props.keyName} </span>
            <span className={styles.value}>{props.value}</span>
        </div>
    )

}


const waterAnimation = () => {
    return (
        <span className={styles.main}>

        </span>
    )
}