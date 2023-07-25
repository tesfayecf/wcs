'use client'
import React from "react";
import TankGroupWidget from "@/app/(pages)/tanks/components/TankGroupWidget/TankGroupWidget";
import styles from "./../styles/Tanks.module.scss"
import TanksHandler from "../TanksHandler";
import TanksLayout from "../components/TanksLayout/TanksLayout";

const tanksHandler = TanksHandler.getInstance();

interface IDashboardProps {
    params: {
        tankGroupId: string
    }
}

const Tanks: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

    React.useEffect(() => {
        tanksHandler.loadParams(props.params);
        tanksHandler.load();
        return () => {
            tanksHandler.unload();
        }
    }, [])

    return (
        <div className={styles.tanks}>
            <div>
                <TankGroupWidget />
            </div>
            <TanksLayout />
        </div>
    )
}

export default Tanks;