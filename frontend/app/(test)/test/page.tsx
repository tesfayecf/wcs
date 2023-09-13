'use client'
import React from "react";
import AppHandler from "@/app/app/AppHandler";
import AuthHandler from "@/app/(auth)/AuthHandler";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";


const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()
const dashboardHandler = DashboardHandler.getInstance()

interface ITestProps extends ReturnType<typeof mapStateToProps> { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <>
        </>
    )
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Test)
