'use client'
import React from "react";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import AuthHandler from "../AuthHandler";
import { connect } from "react-redux";
import { IRootState } from "@/app/lib/store/store";
import { ISignupForm } from "../AuthTypes";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import { useRouter } from "next/navigation";
import LogoIcon from "@/public/svg/LogoIcon";

// test signup password: kcswOpy35P

const authHandler = AuthHandler.getInstance()

interface ISignupProps extends ReturnType<typeof mapStateToProps> { }

const Signup: React.FunctionComponent<ISignupProps> = (props: ISignupProps) => {
    const router = useRouter();
    const [error, setError] = React.useState<boolean>(false)

    const onSignup = async (fields: ISignupForm) => {
        const response = await authHandler.signup(fields);
        if (response.status === 200) {
            router.push('./login');
        } else {
            setError(true)
        }
    }

    const renderTitle = () => {
        return (
            <>
                <h2>SIGN UP. BE THE CHANGE</h2>
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

    const additionalButtons: React.JSX.Element = (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: "5px 5px",
            padding: "0px 45px"
        }}>
            <button
                onClick={() => {
                    router.push('./login')
                }}
                style={additionalButtonStyle}>
                Log in
            </button>
        </div>
    )

    return (
        <div className={"signup"}>
            <div className={"logo"}>
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
                            top: "-15px"
                        }
                    }}
                >
                    <FormTemplate<ISignupForm>
                        title={renderTitle()}
                        titleStyle={titleStyle}
                        externalError={error}
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
                </PopUpTemplate>
            </div>
        </div>
    )
    return null
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Signup)
