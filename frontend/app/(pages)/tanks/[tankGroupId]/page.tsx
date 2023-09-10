'use client'
import React from "react";
import TankGroupInfoWidget from "@/app/(pages)/tanks/components/TankGroupInfoWidget/TankGroupInfoWidget";
import styles from "./styles/Tanks.module.scss"
import TanksHandler from "../TanksHandler";
import TankElements from "../components/TankElements/TankElements";
import AddTankWidget from "../components/AddTankWidget/AddTankWidget";
import AddTankPopUp from "../components/AddTankWidget/AddTankPopUp";

const tanksHandler = TanksHandler.getInstance();

interface IDashboardProps {
    params: {
        tankGroupId: string
    }
}

const Tanks: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

    React.useEffect(() => {
        tanksHandler.load(props.params);
        return () => {
            tanksHandler.unload();
        }
    }, [])

    console.log("Rerender tanks page");

    return (
        <div id={"tanksPage"} className={styles.tanks}>
            <div id={"tankGroupMenu"} className={styles.tankGroupMenu}>
                <TankGroupInfoWidget />
                <AddTankWidget />
            </div>
            <TankElements />
            <AddTankPopUp />
        </div>
    )
}

export default Tanks;