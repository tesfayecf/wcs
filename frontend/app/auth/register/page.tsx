'use client'
import React from "react";
import styles from "./styles/Register.module.scss"
import PopUpFormTemplate from "@/app/components/popUp/PopUpFormTemplate";
import { useStore } from "@/app/store/store";
import AuthHandler from "../AuthHandler";

const authHadler = AuthHandler.getInstance()

interface IRegisterProps { }

const Register: React.FunctionComponent<IRegisterProps> = (props: IRegisterProps) => {

    const registerForm = useStore().AuthStore.store.registerForm;

    const onFNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHadler.setRegisterForm({ ...registerForm, first_name: event.target.value });
    }

    const onLNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHadler.setRegisterForm({ ...registerForm, last_name: event.target.value });
    }

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHadler.setRegisterForm({ ...registerForm, email: event.target.value });
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHadler.setRegisterForm({ ...registerForm, password: event.target.value });
    }

    const onRePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        authHadler.setRegisterForm({ ...registerForm, re_password: event.target.value });
    }

    return (
        <div className={styles.register}>
            <div className={styles.form}>
                <PopUpFormTemplate
                    title="Register"
                    open={true}
                    onSubmit={() => { }}
                    submitButtonText="Add"
                    hideCancelButton={true}
                    fields={[
                        {
                            name: "Frist Name",
                            type: "textInput",
                            placeholder: "Frist Name",
                            value: registerForm.email,
                            onChange: onFNameChange,
                            error: registerForm.emailError,
                        },
                        {
                            name: "Last Name",
                            type: "textInput",
                            placeholder: "Last Name",
                            value: registerForm.email,
                            onChange: onLNameChange,
                            error: registerForm.emailError,
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
                            value: registerForm.email,
                            onChange: onPasswordChange,
                            error: registerForm.emailError,
                            // password: true
                        },
                        {
                            name: "Confirm Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: registerForm.email,
                            onChange: onRePasswordChange,
                            error: registerForm.emailError,
                            // password: true
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Register;