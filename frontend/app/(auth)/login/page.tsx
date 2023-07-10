'use client'
import React from "react";
import styles from "./styles/Login.module.scss"
import PopUpFormTemplate from "@/app/components/popUp/PopUpFormTemplate";
import AuthHandler from "../AuthHandler";
import { useStore } from "@/app/utils/store/store";

const authHandler = AuthHandler.getInstance()

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {

    const registerForm = useStore().AuthStore.store.loginForm;

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setLoginFormEmail(event.target.value);
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setLoginFormPassword(event.target.value);
    }

    const onLogin = () => {
        authHandler.login();
    }

    return (
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
                            value: registerForm.email,
                            onChange: onEmailChange,
                            error: registerForm.emailError,
                            errorMessage: "Invalid email",

                        },
                        {
                            name: "Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: registerForm.password,
                            onChange: onPasswordChange,
                            error: registerForm.passwordError,
                            errorMessage: "Invalid password",
                            password: true
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Login;
