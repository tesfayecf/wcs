'use client'
import React from "react";
import styles from "./styles/Register.module.scss"
import PopUpFormTemplate from "@/app/components/popUp/PopUpFormTemplate";
import { useStore } from "@/app/store/store";
import AuthHandler from "../AuthHandler";

const authHandler = AuthHandler.getInstance()

interface IRegisterProps { }

const Register: React.FunctionComponent<IRegisterProps> = (props: IRegisterProps) => {

    const registerForm = useStore().AuthStore.store.registerForm;

    const onFNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterForm({ ...registerForm, first_name: event.target.value });
    }

    const onLNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterForm({ ...registerForm, last_name: event.target.value });
    }

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterForm({ ...registerForm, email: event.target.value });
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterForm({ ...registerForm, password: event.target.value });
    }

    const onRePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterForm({ ...registerForm, re_password: event.target.value });
    }

    const onSumbit = React.useCallback(() => {
        console.log("onSumbit");
        authHandler.register();
    }, [])

    return (
        <div className={styles.register}>
            <div className={styles.form}>
                <PopUpFormTemplate
                    title="Register"
                    open={true}
                    onSubmit={onSumbit}
                    submitButtonText="Add"
                    hideCancelButton={true}
                    fields={[
                        {
                            name: "Frist Name",
                            type: "textInput",
                            placeholder: "Frist Name",
                            value: registerForm.first_name,
                            onChange: onFNameChange,
                            error: registerForm.first_nameError,
                        },
                        {
                            name: "Last Name",
                            type: "textInput",
                            placeholder: "Last Name",
                            value: registerForm.last_name,
                            onChange: onLNameChange,
                            error: registerForm.last_nameError,
                        },
                        {
                            name: "Email",
                            type: "textInput",
                            placeholder: "Email",
                            value: registerForm.email,
                            onChange: onEmailChange,
                            error: registerForm.emailError,
                        },
                        {
                            name: "Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: registerForm.password,
                            onChange: onPasswordChange,
                            error: registerForm.passwordError,
                            // password: true
                        },
                        {
                            name: "Confirm Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: registerForm.re_password,
                            onChange: onRePasswordChange,
                            error: registerForm.re_passwordError,
                            // password: true
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Register;