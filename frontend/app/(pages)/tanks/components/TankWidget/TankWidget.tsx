'use client'
import React from 'react';
import WatertankSVG from '@/public/svg/WaterTankSG';
import styles from "./styles/TankWidget.module.scss"
import { IRootState } from '@/app/utils/store/store';
import { connect } from 'react-redux';
import { ISensor, ITank } from '../../TanksTypes';
import ContentBox from '@/app/components/contentBox/ContentBox';

interface ITankWidgetWidgetProps extends ReturnType<typeof mapStateToProps> {
    tank: ITank,
}

const TankWidget: React.FunctionComponent<ITankWidgetWidgetProps> = (props: ITankWidgetWidgetProps) => {
    const size = 125;

    const getStatus = () => {
        const sensor = props.sensors.find(s => s.tank.id === props.tank.id)
        if (!sensor) return "OFF"
        else return "ON"
    }

    const getSensorValue = () => {
        const sensor = props.sensors.find(s => s.tank.id === props.tank.id)
        if (!sensor) return "-"
        const sensorData = props.sensorsData[sensor.id]
        if (!sensorData) return "-"
        return sensorData
    }

    return (
        <ContentBox customBoxClass={styles.tank}>
            {/* {props.status ? " " : <div className={styles.disabled} />} */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.name}>
                        <p>{props.tank.name}</p>
                    </div>
                    <div className={styles.status}>
                        <p className={styles.text}> Status {getStatus()}</p>
                    </div>
                </div>
                <div className={styles.data}>
                    <div className={styles.svg}>
                        <div className={styles.container} >
                            <WatertankSVG height={size} width={size} />
                        </div>
                        <div className={styles.volume}>
                            <p className={styles.text}> {getSensorValue()} / {props.tank.capacity} L</p>
                        </div>
                    </div>
                    <div className={styles.vl}></div>
                    <div className={styles.properties}>
                        <div className={styles.list}>
                            <DataListElement keyName="Type" value={props.tank.type} />
                            <DataListElement keyName="Capacity" value={props.tank.capacity} />
                            <DataListElement keyName="Dimensions" value={props.tank.dimensions} />
                            <DataListElement keyName="Material" value={props.tank.material} />
                            <DataListElement keyName="Brand" value={props.tank.brand} />
                        </div>
                    </div>
                </div>
            </div>
        </ContentBox>

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
