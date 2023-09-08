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

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()
const dashboardHandler = DashboardHandler.getInstance()

interface ITestProps extends ReturnType<typeof mapStateToProps> { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <PopUpTemplate open={true} onClose={() => { }} hideBackDrop={true} >
            <FormTemplate
                title="Add Tank Group"
                externalError={false}
                externalErrorText={""}
                onCancel={() => { }}
                onAccept={() => { }}
                acceptButtonText="Add"
                cancelButtonText="Cancel"
                // isLoading={true}
                fields={[
                    {
                        type: "text",
                        name: "Email",
                        placeholder: "Email",
                        textType: "email"
                    },
                    {
                        type: "text",
                        name: "Password",
                        placeholder: "Password",
                        textType: "password"
                    },
                    {
                        type: "select",
                        name: "Location",
                        placeholder: "Select your location",
                        selectItems: [
                            "Option 1",
                            "Option 2",
                            "Option 3",
                        ]
                    },
                    {
                        type: "multitext",
                        name: "Description",
                        placeholder: "Describe here",
                        rows: 4,
                    },
                ]}
            />
        </PopUpTemplate>
    )
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Test)
