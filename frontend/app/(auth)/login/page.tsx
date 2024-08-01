'use client'
import React from "react";
import Link from "next/link";
import FormTemplate from "@/app/components/form/Form";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import { ILoginForm } from "@/app/(auth)/types"
import LogoIcon from "@/public/svg/LogoIcon";
import { login } from "@/app/(auth)/actions";
import { useRouter } from 'next/navigation'

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter()

    const renderAdditionalButtons: () => JSX.Element | null = () => {
        return (
            <div style={additionalButtonsContainer}>
                <Link href={'/recover'} style={additionalButtonStyle}>
                    Forgot password?
                </Link>
                <Link href={'/signup'} style={additionalButtonStyle}>
                    Sign up
                </Link>
            </div >
        )
    }

    const onLogin = (loginForm: ILoginForm) => {
        const response = login(loginForm);
        if (response) router.push('/dashboard');
    }

    return (
        <div className={"login"}>
            <div className="logo"> <LogoIcon size={2200} /> </div>
            <div className={"form"}>
                <PopUpTemplate
                    open={true}
                    hideBackDrop={true}
                    paperProps={{
                        elevation: 0,
                        style: { top: "75px" }
                    }}
                >
                    <FormTemplate<ILoginForm>
                        title={<h2>LOG IN. BE THE CHANGE</h2>}
                        titleStyle={titleStyle}
                        externalError={false}
                        externalErrorText={"Invalid credentials"}
                        onAccept={onLogin}
                        onCancel={() => { }}
                        acceptButton="Log in"
                        acceptButtonStyle={acceptButtonStyle}
                        cancelButton=""
                        showCancelButton={false}
                        additionalButtons={renderAdditionalButtons()}
                        isLoading={false}
                        fields={[
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
                            }
                        ]}
                    />
                </PopUpTemplate>
            </div>
        </div>
    )
}

export default Login;

const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    marginBottom: "10px",
}

const acceptButtonStyle: React.CSSProperties = {
    width: "100%",
    height: "35px"
}

const additionalButtonsContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "30px",
    margin: "5px 5px",
    padding: "0px 45px"
}

const additionalButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "inherit"
}

additionalButtonStyle[':hover'] = {
    backgroundColor: "#55dc9e",
};
