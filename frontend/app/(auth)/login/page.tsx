'use client'
import React from "react";
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import PopUpTemplate from "@/app/components/popUpTemplate/PopUpTemplate";
import { ILoginFormN } from "@/app/(auth)/AuthTypes"
import AuthHandler from "../AuthHandler";
import AppHandler from "@/app/app/AppHandler";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import CheckAuth from "@/app/utils/auth/checkAuth";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter();

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
            console.log("Error")
        }
    }

    return (
        <CheckAuth>
            <div className={"login"}>
                <div className={"form"}>
                    <PopUpTemplate
                        hideBackDrop={true}
                        open={true}
                        onClose={() => { }}
                    >
                        <FormTemplate<ILoginFormN>
                            title="Log in"
                            externalError={false}
                            externalErrorText={"Invalid credentials"}
                            onCancel={() => { }}
                            onAccept={onLogin}
                            acceptButtonText="Log in"
                            cancelButtonText="Cancel"
                            hideCancelButton={false}
                            isLoading={false}
                            fields={[
                                {
                                    name: "Email",
                                    type: "text",
                                    placeholder: "",
                                    textType: "email"
                                },
                                {
                                    name: "Password",
                                    type: "text",
                                    placeholder: "",
                                    textType: "password"
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