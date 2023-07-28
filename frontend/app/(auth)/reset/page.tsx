'use client'
import React from "react";
import styles from "./styles/Reset.module.scss"


interface IResetProps { }

const Reset: React.FunctionComponent<IResetProps> = (props: IResetProps) => {

    return (
        <div className={styles.reset}>

        </div>
    )
}

export default Reset;