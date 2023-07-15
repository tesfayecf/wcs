'use client'
import React from "react";
import styles from "./styles/Login.module.scss"
import PopUpFormTemplate from "@/app/components/popUp/PopUpFormTemplate";
import AuthHandler from "../AuthHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";

const authHandler = AuthHandler.getInstance()

interface ILoginProps extends ReturnType<typeof mapStateToProps> { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {

    // const registerForm = useStore().AuthStore.store.loginForm;

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
    )
}

export default connect(mapStateToProps)(Login)



function mapStateToProps(state: IRootState) {
    return {
        loginForm: state.auth.loginForm
    }
}
