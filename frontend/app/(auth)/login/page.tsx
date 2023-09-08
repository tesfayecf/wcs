'use client'
import React from "react";
import styles from "./styles/Login.module.scss"
import FormTemplate from "@/app/components/formTemplate/FormTemplate";
import AuthHandler from "../AuthHandler";
import AppHandler from "@/app/app/AppHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";
import { useRouter } from 'next/navigation';
import CheckAuth from "@/app/utils/auth/checkAuth";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()

interface ILoginProps extends ReturnType<typeof mapStateToProps> { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter();

    React.useEffect(() => {
        authHandler.load();
        return () => {
            authHandler.unload();
        }
    }, [])

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setLoginFormEmail(event.target.value);
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setLoginFormPassword(event.target.value);
    }

    const onLogin = async () => {
        const response = await authHandler.login();
        if (response.status === 200) {
            router.push('./dashboard');
            appHandler.setAuth();
        } else {
            console.log("Error") // Error handler
        }
    }

    return (
        <>
            <CheckAuth>
                <div className={styles.login}>
                    <div className={styles.form}>
                        {/* <PopUpFormTemplate
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
                        /> */}
                    </div>
                </div>
            </CheckAuth>
        </>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {
        loginForm: state.auth.loginForm,
    }
}

export default connect(mapStateToProps, {})(Login);