'use client'
import React from 'react';
import styles from "./styles/TankGroupWidget.module.scss"
import { ITankGroup } from '../../DashboardTypes';
import Link from 'next/link';
import ContentBox from '@/app/components/contentBox/ContentBox';


type ITankGroupWidgetProps = {
    tankGroup: ITankGroup
}


const TankGroupWidget2: React.FunctionComponent<ITankGroupWidgetProps> = (props: ITankGroupWidgetProps) => {


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
                    <div className={styles.banner} />
                    <div className={styles.info}>
                        <div className={styles.name}>{props.tankGroup.name}</div>
                        <div className={styles.location}>{props.tankGroup.location}</div>
                    </div>
                </div>
            </Link >
        </ContentBox>

    )
}

export default TankGroupWidget2;