'use client'
import React from "react";
import styles from "./styles/Login.module.scss"
import PopUpFormTemplate from "../components/popUp/PopUpFormTemplate";


interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {

    return (
        <div className={styles.login}>

        </div>
    )
}

export default Login;


{/* <PopUpFormTemplate
    fields={
        [
            {
                name: "Email",
                type: "textInput",
                placeholder: "Email",
                value: "",
                onChange: () => { },
                error: false,
            },
            {
                name: "Password",
                type: "textInput",
                placeholder: "Password",
                value: "",
                onChange: () => { },
                error: false,
            },
        ]
    }
    onCancel={() => { }}
    onSubmit={() => { }}
    open={true}
    onCancelButtonText="Cancel"
    submitButtonText="Login"
    title="LOGIN"
/>
*/}
