// Import necessary modules and components
import React, { useState } from "react";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import AuthHandler from "../AuthHandler";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import { IResetPasswordFormN } from "../AuthTypes";

const authHandler = AuthHandler.getInstance();

interface IResetProps { }

const Reset: React.FunctionComponent<IResetProps> = (props: IResetProps) => {
    const [error, setError] = useState<boolean>(false);

    const onResetPassword = async (fields: IResetPasswordFormN) => { };

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
                    elevation={0}
                >
                    <FormTemplate<IResetPasswordFormN>
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
                        fields={[]}
                    />
                </PopUpTemplate>
            </div>
        </div>
    );
};

export default Reset;
