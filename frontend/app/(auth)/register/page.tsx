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

    const onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterFormFirstName(event.target.value);
    }

    const onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterFormLastName(event.target.value);
    }

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterFormEmail(event.target.value);
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterFormPassword(event.target.value);
    }

    const onRePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHandler.setRegisterFormRePassword(event.target.value);
    }

    const onRegister = React.useCallback(() => {
        authHandler.verify("");
        // authHandler.setRegisterForm({
        //     first_name: "",
        //     first_nameError: false,
        //     last_name: "",
        //     last_nameError: false,
        //     email: "",
        //     emailError: false,
        //     password: "",
        //     passwordError: false,
        //     re_password: "",
        //     re_passwordError: false,
        // })
    }, [])

    return (
        <div className={styles.register}>
            <div className={styles.form}>
                <PopUpFormTemplate
                    title="Register"
                    open={true}
                    onSubmit={onRegister}
                    submitButtonText="Register"
                    hideCancelButton={true}
                    hideBackDrop={true}
                    fields={[
                        {
                            name: "Frist Name",
                            type: "textInput",
                            placeholder: "Frist Name",
                            value: registerForm.first_name,
                            onChange: onFirstNameChange,
                            error: registerForm.first_nameError,
                            errorMessage: "Invalid name",

                        },
                        {
                            name: "Last Name",
                            type: "textInput",
                            placeholder: "Last Name",
                            value: registerForm.last_name,
                            onChange: onLastNameChange,
                            error: registerForm.last_nameError,
                            errorMessage: "Invalid name"
                        },
                        {
                            name: "Email",
                            type: "textInput",
                            placeholder: "Email",
                            value: registerForm.email,
                            onChange: onEmailChange,
                            error: registerForm.emailError,
                            errorMessage: "Invalid email"
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
                        },
                        {
                            name: "Confirm Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: registerForm.re_password,
                            onChange: onRePasswordChange,
                            error: registerForm.re_passwordError,
                            errorMessage: "Invalid password",
                            password: true
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Register;