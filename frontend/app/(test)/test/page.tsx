'use client'
import React from "react";
import CustomForm from "@/app/components/form/CustomForm";
import { ILoginForm } from "@/app/(auth)/types";

interface ITestProps { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <>
            <CustomForm<ILoginForm>
                open={true}
                title={"LOG IN. BE THE CHANGE"}
                onAccept={() => { }}
                acceptText="Log in"
                onCancel={() => { }}
                cancelText="Cancel"
                closable={false}
                footerClassName="footter"
                fields={[
                    {
                        key: "email",
                        type: "text",
                        label: "Email",
                    },
                    {
                        key: "password",
                        type: "text",
                        label: "Password",
                    }
                ]}
            />
        </>
    )
}

export default Test;
