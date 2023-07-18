'use client'
import React from 'react';
import styles from "./styles/WaterTankWidget.module.scss"
import WatertankSVG from '@/public/svg/WaterTankSG';
import { HEXToVBColor, VBColorToHEX } from '@/app/utils/lib/styles';

type IWatertankProps = {
    id: number,
    name: string,
    type: string,
    capacity: number,
    dimensions: string,
    brand: string,
    material: string,
    status: boolean
}


const WaterTankWidget: React.FunctionComponent<IWatertankProps> = (props: IWatertankProps) => {
    const size = 125;

    const status = props.status ? "ON" : "OFF";
    const statusCol = props.status ? "#96cfbb" : "#ff614d";
    const levelSataus = props.status ? 90 : "-"

    const startColor = "#696c74";
    const endColor = "#e6e6e6";
    const stateColor = props.status ? "#96cfbb" : "#ff614d";
    const gradient = "linear-gradient(180deg, " + endColor + " 0%, " + endColor + " 90%, " + stateColor + " 100%";



    return (
        <div className={styles.watertank}>
            {/* {props.status ? " " : <div className={styles.disabled} />} */}
            <div className={styles.content} style={{ background: gradient }}>
                <div className={styles.header}>
                    <div className={styles.name}>
                        <p>{props.name}</p>
                    </div>
                    <div className={styles.status}>
                        <p className={styles.text} style={{ color: statusCol }}> Status {status}</p>
                    </div>
                </div>
                <div className={styles.data}>
                    <div className={styles.svg}>
                        <div className={styles.container} >
                            <WatertankSVG height={size} width={size} />
                        </div>
                        <div className={styles.volume}>
                            <p className={styles.text}> {levelSataus} / {props.capacity} L</p>
                        </div>
                    </div>
                    <div className={styles.vl}></div>
                    <div className={styles.properties}>
                        <div className={styles.list}>
                            <DataListElement keyName="Type" value={props.type} />
                            <DataListElement keyName="Capacity" value={props.capacity} />
                            <DataListElement keyName="Dimensions" value={props.dimensions} />
                            <DataListElement keyName="Material" value={props.material} />
                            <DataListElement keyName="Brand" value={props.brand} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaterTankWidget;


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
