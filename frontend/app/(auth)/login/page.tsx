'use client'
import React from "react";
import styles from "./styles/Login.module.scss"
import PopUpFormTemplate from "@/app/components/popUp/PopUpFormTemplate";
import AuthHandler from "../AuthHandler";
import AppHandler from "@/app/app/AppHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";
import { redirect, useRouter } from 'next/navigation';
import CheckAuth from "@/app/utils/auth/checkAuth";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()

interface ILoginProps extends ReturnType<typeof mapStateToProps> { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setLoginFormEmail(event.target.value);
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setLoginFormPassword(event.target.value);
    }

    const onLogin = async () => {
        const router = useRouter();
        const response = await authHandler.login();
        if (response.status === 200) {
            appHandler.setAuth();
            router.push('./dashboard');
            // redirect('./dashboard')
        } else {
            console.log("Error")
        }
    }

    return (
        <>
            <CheckAuth>
                <div className={styles.login}>
                    <div className={styles.form}>
                        <PopUpFormTemplate
                            title="Login"
                            open={true}
                            onSubmit={onLogin}
                            submitButtonText="Login"
                            hideCancelButton={true}
                            hideBackDrop={true}
                            fields={[
                                {
                                    name: "Email",
                                    type: "textInput",
                                    placeholder: "Email",
                                    value: props.loginForm.email,
                                    onChange: onEmailChange,
                                    error: props.loginForm.emailError,
                                    errorMessage: "Invalid email",

                                },
                                {
                                    name: "Password",
                                    type: "textInput",
                                    placeholder: "Password",
                                    value: props.loginForm.password,
                                    onChange: onPasswordChange,
                                    error: props.loginForm.passwordError,
                                    errorMessage: "Invalid password",
                                    password: true
                                }
                            ]}
                        />
                    </div>
                </div>
            </CheckAuth>
        </>
    )
}

export default connect(mapStateToProps)(Login)



function mapStateToProps(state: IRootState) {
    return {
        loginForm: state.auth.loginForm
    }
}
