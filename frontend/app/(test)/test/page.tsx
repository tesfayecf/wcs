'use client'
import React from "react";
import AppHandler from "@/app/app/AppHandler";
import AuthHandler from "@/app/(auth)/AuthHandler";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";
import TankGroupWidget from "@/app/(pages)/dashboard/components/TankGroupWidget/TankGroupWidget";
import ContentBox from "@/app/components/contentBox/ContentBox";
import Navbar from "@/app/components/navbar/Navbar";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()
const dashboardHandler = DashboardHandler.getInstance()

interface ITestProps extends ReturnType<typeof mapStateToProps> { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <div >
            <Navbar />
        </div>
    )
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Test)
