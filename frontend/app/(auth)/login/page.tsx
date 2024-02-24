'use client'
import React from "react";
import { useRouter } from "next/navigation";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import AuthHandler from "@/app/(auth)/AuthHandler";
import { ILoginForm } from "@/app/(auth)/AuthTypes"
import LogoIcon from "@/public/svg/LogoIcon";

const authHandler = AuthHandler.getInstance()

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter();
    const [error, setError] = React.useState<boolean>(false)

    const onLogin = async (fields: ILoginForm) => {
        const response = await authHandler.login(fields);
        if (response.status === 200) {
            router.push('./dashboard');
        } else {
            setError(true)
        }
    }

    const renderTitle = () => { return <h2>LOG IN. BE THE CHANGE</h2> }



    const additionalButtons: React.JSX.Element = (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "30px",
            margin: "5px 5px",
            padding: "0px 45px"
        }}>
            <button
                onClick={() => {
                    router.push('./reset')
                }}
                style={additionalButtonStyle}>
                Forgot password?
            </button>
            <button
                onClick={() => {
                    router.push('./signup')
                }}
                style={additionalButtonStyle}>
                Sign up
            </button>
        </div >
    )

    return (
        <div className={"login"}>
            <div className="logo">
                <LogoIcon size={2200} />
            </div>
            <div className={"form"}>
                <PopUpTemplate
                    open={true}
                    onClose={() => { }}
                    hideBackDrop={true}
                    paperProps={{
                        elevation: 0,
                        style: {
                            top: "100px"
                        }
                    }}
                >
                    <FormTemplate<ILoginForm>
                        title={renderTitle()}
                        titleStyle={titleStyle}
                        externalError={error}
                        externalErrorText={"Invalid credentials"}
                        onAccept={onLogin}
                        onCancel={() => { }}
                        acceptButton="Log in"
                        acceptButtonStyle={acceptButtonStyle}
                        cancelButton=""
                        showCancelButton={false}
                        additionalButtons={additionalButtons}
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

const additionalButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer"
}

additionalButtonStyle[':hover'] = {
    backgroundColor: "#55dc9e",  // Replace with the color you want on hover
};