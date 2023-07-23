'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import TankGroupWidget from "@/app/(pages)/tanks/components/TankGroupWidget/TankGroupWidget";
import styles from "./../styles/Tanks.module.scss"
import { ITankGroup } from "@/app/(pages)/dashboard/DashboardTypes";
import TanksHandler from "../TanksHandler";

const tanksHandler = TanksHandler.getInstance();

interface IDashboardProps extends ReturnType<typeof mapStateToProps> {
    params: {
        tankGroupId: string
    }
}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {

    React.useEffect(() => {
        tanksHandler.load();
        return () => {
            tanksHandler.unload();
        }
    }, [])

    const getTankGroup = React.useCallback(() => {
        const foundIndex = props.tankGroups.findIndex((tankGroup: ITankGroup) => tankGroup.id === parseInt(props.params.tankGroupId))
        if (foundIndex === -1) throw new Error("TankGroup not found"); // got not found page
        return props.tankGroups[foundIndex] as ITankGroup;
    }, [])


    return (
        <div className={styles.tanks}>
            <TankGroupWidget tankGroup={getTankGroup()} />
        </div>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {
        tankGroups: state.dashboard.tankGroups,
    }
}

export default connect(mapStateToProps, {})(Dashboard);