'use client'
import React from 'react';
import WatertankSVG from '@/public/svg/WaterTankSG';
import styles from "./styles/TankGroupWidget.module.scss"
import { ITankGroup } from '../../DashboardTypes';
import Link from 'next/link';
import ContentBox from '@/app/components/contentBox/ContentBox';
import DotMenu from '@/public/svg/DotMenuIcon';
import ButtonTemplate from '@/app/components/buttonTemplate/ButtonTemplate';
import { store } from '@/app/utils/store/store';
import { appActions } from '@/app/app/AppReducer';

type ITankGroupWidgetProps = {
    tankGroup: ITankGroup
}


const TankGroupWidget: React.FunctionComponent<ITankGroupWidgetProps> = (props: ITankGroupWidgetProps) => {
    const size = 125;

    const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        console.log("Button clicked");
        event.stopPropagation();
    };

    return (
        <ContentBox customBoxClass={styles.group}>
            <Link href={`/tanks/${props.tankGroup.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.name}>
                            <p style={{ textTransform: "uppercase" }}>{props.tankGroup.name}</p>
                        </div>
                        <div className={styles.status}>
                            <p className={styles.text}>{props.tankGroup.id}</p>
                        </div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.icon}>
                            <div className={styles.container} >
                                <WatertankSVG height={size} width={size} />
                            </div>
                            <div className={styles.location}>
                                <p className={styles.text}> {props.tankGroup.location}</p>
                            </div>
                        </div>
                        <div className={styles.vl}></div>
                        <div className={styles.properties}>
                            <div className={styles.list}>
                                <DataListElement keyName="Name" value={props.tankGroup.name} />
                                <DataListElement keyName="Location" value={props.tankGroup.location} />
                            </div>
                            <div className={styles.menu}>
                                <div onClick={handleButtonClick}>
                                    <ButtonTemplate
                                        size={40}
                                        icon={<DotMenu fill='00000' size={20} stroke={"00000"} />}
                                        disabled={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link >
        </ContentBox>

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
