'use client'
import React from "react";
import styles from "./styles/Register.module.scss"
import PopUpFormTemplate from "@/app/components/popUp/PopUpFormTemplate";
import AuthHandler from "../AuthHandler";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";

const authHandler = AuthHandler.getInstance()

interface IRegisterProps extends ReturnType<typeof mapStateToProps> { }

const Register: React.FunctionComponent<IRegisterProps> = (props: IRegisterProps) => {

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
        authHandler.register();
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
                            value: props.registerForm.firstName,
                            onChange: onFirstNameChange,
                            error: props.registerForm.firstNameError,
                            errorMessage: "Invalid name",

                        },
                        {
                            name: "Last Name",
                            type: "textInput",
                            placeholder: "Last Name",
                            value: props.registerForm.lastName,
                            onChange: onLastNameChange,
                            error: props.registerForm.lastNameError,
                            errorMessage: "Invalid name"
                        },
                        {
                            name: "Email",
                            type: "textInput",
                            placeholder: "Email",
                            value: props.registerForm.email,
                            onChange: onEmailChange,
                            error: props.registerForm.emailError,
                            errorMessage: "Invalid email"
                        },
                        {
                            name: "Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: props.registerForm.password,
                            onChange: onPasswordChange,
                            error: props.registerForm.passwordError,
                            errorMessage: "Invalid password",
                            password: true
                        },
                        {
                            name: "Confirm Password",
                            type: "textInput",
                            placeholder: "Password",
                            value: props.registerForm.rePassword,
                            onChange: onRePasswordChange,
                            error: props.registerForm.rePasswordError,
                            errorMessage: "Invalid password",
                            password: true
                        }
                    ]}
                />
            </div>
        </div>
    )
    return null
}

export default connect(mapStateToProps)(Register)

function mapStateToProps(state: IRootState) {
    return {
        registerForm: state.auth.registerForm
    }
}
