'use client'
import React from "react";
import Link from "next/link";
import Form from "@/app/components/form/Form";
import { ISignupForm } from "@/app/(auth)/types";
import Popup from "@/app/components/popup/Popup";
import LogoIcon from "@/public/svg/LogoIcon";

// test signup password: kcswOpy35P


interface ISignupProps { }

const Signup: React.FunctionComponent<ISignupProps> = (props: ISignupProps) => {

    const onSignup = async (fields: ISignupForm) => { }

    const additionalButtons: React.JSX.Element = (
        <div style={additionalButtonsContainer}>
            <Link href={"./login"} style={additionalButtonStyle}>
                Log in
            </Link>
        </div>
    )

    return (
        <div className={"signup"}>
            <div className="logo"> <LogoIcon size={2200} /> </div>
            <div className={"form"}>
                <Popup
                    open={true}
                    hideBackDrop={true}
                    paperProps={{
                        elevation: 0,
                        style: { top: "-15px" }
                    }}
                >
                    <Form<ISignupForm>
                        title={<h2>SIGN UP. BE THE CHANGE</h2>}
                        titleStyle={titleStyle}
                        externalError={false}
                        externalErrorText={"Invalid credentials"}
                        onAccept={onSignup}
                        onCancel={() => { }}
                        acceptButton="Sign up"
                        acceptButtonStyle={acceptButtonStyle}
                        cancelButton=""
                        showCancelButton={false}
                        additionalButtons={additionalButtons}
                        isLoading={false}
                        fields={[
                            {
                                key: "firstName",
                                name: "Frist Name",
                                type: "text",
                                placeholder: "",
                                textType: "text",
                            },
                            {
                                key: "lastName",
                                name: "Last Name",
                                type: "text",
                                placeholder: "",
                                textType: "text",
                            },
                            {
                                key: "email",
                                name: "Email",
                                type: "text",
                                placeholder: "",
                                textType: "email"
                            },
                            {
                                key: "password",
                                name: "Password",
                                type: "text",
                                placeholder: "",
                                textType: "password",
                            },
                            {
                                key: "confirmPassword",
                                name: "Confirm Password",
                                type: "text",
                                placeholder: "",
                                textType: "password",
                            }
                        ]}
                    />
                </Popup>
            </div>
        </div>
    )
    return null
}

export default Signup;


const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
}

const acceptButtonStyle: React.CSSProperties = {
    width: "100%",
    height: "35px"
}

const additionalButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer"
}

additionalButtonStyle[':hover'] = {
    backgroundColor: "#55dc9e",  // Replace with the color you want on hover
};

const additionalButtonsContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "5px 5px",
    padding: "0px 45px"
}