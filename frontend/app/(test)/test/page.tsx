'use client'
import React from "react";
import AppHandler from "@/app/app/AppHandler";
import AuthHandler from "@/app/(auth)/AuthHandler";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";
import Navbar from "@/app/components/navbar/Navbar";
import HeaderWidget from "@/app/components/header/HeaderWidget";
import Header from "@/app/components/header/Header";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import TankGroupWidget from "@/app/(pages)/dashboard/components/TankGroupWidget/TankGroupWidgetV1";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()
const dashboardHandler = DashboardHandler.getInstance()

interface ITestProps extends ReturnType<typeof mapStateToProps> { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <TankGroupWidget
            tankGroup={{
                id: 1,
                name: "Tank 1",
                location: "Tank 1 location",
                description: "Tank 1 description",
            }}
        />
    )
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Test)
