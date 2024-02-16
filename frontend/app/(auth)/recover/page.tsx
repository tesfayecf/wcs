'use client'
import React, { useState } from "react";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import AuthHandler from "../AuthHandler";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import { IResetForm } from "../AuthTypes";

const authHandler = AuthHandler.getInstance();

interface IResetProps { }

const Reset: React.FunctionComponent<IResetProps> = (props: IResetProps) => {
    const [error, setError] = useState<boolean>(false);

    const onResetPassword = async (fields: IResetForm) => { };

    const renderTitle = () => {
        return (
            <>
                <h1>SMATER+</h1>
                <h2>RESET PASSWORD</h2>
            </>
        );
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "16px",
        fontWeight: "bold",
    };

    const acceptButtonStyle: React.CSSProperties = {
        width: "100%",
        height: "35px",
    };

    return (
        <div className={"reset"}>
            <div className={"form"}>
                <PopUpTemplate
                    open={true}
                    onClose={() => { }}
                    hideBackDrop={true}
                    paperProps={{
                        elevation: 0,
                    }}
                >
                    <FormTemplate<IResetForm>
                        title={renderTitle()}
                        titleStyle={titleStyle}
                        externalError={error}
                        externalErrorText={"Invalid email or error message"}
                        onAccept={onResetPassword}
                        onCancel={() => { }}
                        acceptButton="Reset Password"
                        acceptButtonStyle={acceptButtonStyle}
                        cancelButton=""
                        showCancelButton={false}
                        isLoading={false}
                        fields={[
                            {
                                key: "oldPassword",
                                name: "Old password",
                                type: "text",
                                placeholder: "",
                                textType: "password"
                            },
                            {
                                key: "newPassword",
                                name: "New password",
                                type: "text",
                                placeholder: "",
                                textType: "password"
                            },
                            {
                                key: "confirmPassword",
                                name: "Confirm password",
                                type: "text",
                                placeholder: "",
                                textType: "password"
                            },
                        ]}
                    />
                </PopUpTemplate>
            </div>
        </div>
    );
};

export default Reset;
