'use client'
import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import AuthHandler from "@/app/(auth)/AuthHandler";
import { ILoginFormN } from "@/app/(auth)/AuthTypes"
import AppHandler from "@/app/app/AppHandler";
import { IRootState } from "@/app/utils/store/store";
import CheckAuth from "@/app/utils/auth/checkAuth";
import LogoIcon from "@/public/svg/LogoIcon";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter();
    const [error, setError] = React.useState<boolean>(false)

    React.useEffect(() => {
        authHandler.load();
        return () => {
            authHandler.unload();
        }
    }, [])

    const onLogin = async (fields: ILoginFormN) => {
        const response = await authHandler.login(fields);
        if (response.status === 200) {
            router.push('./dashboard');
            appHandler.setAuth();
        } else {
            setError(true)
        }
    }

    const renderTitle = () => {
        return (
            <>
                <h1>SMATER+</h1>
                <h2>LOG IN. BE THE CHANGE</h2>
            </>
        )
    }

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

    const additionalButton: React.JSX.Element = (
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
        <CheckAuth>
            <div className={"login"}>
                <div className={"form"}>
                    <PopUpTemplate
                        open={true}
                        onClose={() => { }}
                        hideBackDrop={true}
                        elevation={0}
                    >
                        <FormTemplate<ILoginFormN>
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
                            additionalButtons={additionalButton}
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
        </CheckAuth>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(Login);