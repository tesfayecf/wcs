'use client'
import React from 'react';
import WatertankSVG from '@/public/svg/WaterTankSG';
import styles from "./styles/TankGroupWidget.module.scss"
import { ITankGroup } from '../../DashboardTypes';

type ITankGroupWidgetProps = {
    tankGroup: ITankGroup
}


const TankGroupWidget: React.FunctionComponent<ITankGroupWidgetProps> = (props: ITankGroupWidgetProps) => {
    const size = 125;

    return (
        <div className={styles.group}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.name}>
                        <p>{props.tankGroup.name}</p>
                    </div>
                    <div className={styles.status}>
                        <p className={styles.text}>{props.tankGroup.id}</p>
                    </div>
                </div>
                <div className={styles.data}>
                    <div className={styles.svg}>
                        <div className={styles.container} >
                            <WatertankSVG height={size} width={size} />
                        </div>
                        <div className={styles.volume}>
                            <p className={styles.text}> {props.tankGroup.location}</p>
                        </div>
                    </div>
                    <div className={styles.vl}></div>
                    <div className={styles.properties}>
                        <div className={styles.list}>
                            <DataListElement keyName="Name" value={props.tankGroup.name} />
                            <DataListElement keyName="Location" value={props.tankGroup.location} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TankGroupWidget;


interface IDataListElementProps {
    keyName: string;
    value: string | number;
}

const DataListElement: React.FunctionComponent<IDataListElementProps> = (props: IDataListElementProps) => {
    return (
        <div className={styles.element}>
            <span className={styles.key}> {props.keyName} </span>
            <span className={styles.value}>{props.value}</span>
        </div>
    )

}
