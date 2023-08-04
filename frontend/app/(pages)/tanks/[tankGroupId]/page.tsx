'use client'
import React from "react";
import TankGroupInfoWidget from "@/app/(pages)/tanks/components/TankGroupInfoWidget/TankGroupInfoWidget";
import styles from "./styles/Tanks.module.scss"
import TanksHandler from "../TanksHandler";
import TanksLayout from "../components/TanksLayout/TanksLayout";
import AddTankWidget from "../components/AddTankWidget/AddTankWidget";

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

    return (
        <div id={"tanksPage"} className={styles.tanks}>
            <div id={"tankGroupMenu"}>
                <TankGroupInfoWidget />
                <AddTankWidget />
            </div>
            <div id={"tanks"}>
                <TanksLayout />
            </div>
        </div>
    )
}

export default Tanks;