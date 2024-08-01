'use client'
import React from "react";
import FormTemplate from "@/app/components/form/Form";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import { IResetForm } from "../types";

interface IResetProps { }

const Reset: React.FunctionComponent<IResetProps> = (props: IResetProps) => {

    const onResetPassword = async (fields: IResetForm) => { };

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
                        title={<h2>RESET PASSWORD</h2>}
                        titleStyle={titleStyle}
                        externalError={false}
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


const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
};

const acceptButtonStyle: React.CSSProperties = {
    width: "100%",
    height: "35px",
};
