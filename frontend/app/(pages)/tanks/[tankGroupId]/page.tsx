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
        tanksHandler.loadParams(props.params);
        tanksHandler.load();
        return () => {
            tanksHandler.unload();
        }
    }, [])

    return (
        <div className={styles.tanks}>
            <TankGroupWidget tankGroup={props.tankGroupInfo} />
        </div>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {
        tankGroupInfo: state.tanks.tankGroupInfo,
        tanks: state.tanks.tankGroupInfo
    }
}

export default connect(mapStateToProps, {})(Dashboard);