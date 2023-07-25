'use client'
import React from 'react';
import WatertankSVG from '@/public/svg/WaterTankSG';
import styles from "./styles/TankWidget.module.scss"
import { IRootState } from '@/app/utils/store/store';
import { connect } from 'react-redux';
import { ITank } from '../../TanksTypes';

interface ITankWidgetWidgetProps extends ReturnType<typeof mapStateToProps> {
    tank: ITank
}

const TankWidget: React.FunctionComponent<ITankWidgetWidgetProps> = (props: ITankWidgetWidgetProps) => {
    const size = 125;

    const status = props.tank.isActive ? "ON" : "OFF"

    return (
        <div className={styles.tank}>
            {/* {props.status ? " " : <div className={styles.disabled} />} */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.name}>
                        <p>{props.tank.name}</p>
                    </div>
                    <div className={styles.status}>
                        <p className={styles.text}> Status {status}</p>
                    </div>
                </div>
                <div className={styles.data}>
                    <div className={styles.svg}>
                        <div className={styles.container} >
                            <WatertankSVG height={size} width={size} />
                        </div>
                        <div className={styles.volume}>
                            <p className={styles.text}> {"levelSataus"} / {props.tank.capacity} L</p>
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
        </div >
    )
}


function mapStateToProps(state: IRootState) {
    return {
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
