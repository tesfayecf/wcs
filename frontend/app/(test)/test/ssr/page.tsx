'use server'
import React, { Suspense } from "react";
import LoginButton from "./LoginButton";
import { cookies, headers } from 'next/headers'

interface IApiProps { }

const SSR: React.FunctionComponent<IApiProps> = async (props: IApiProps) => {

    // const auhenticate = async () => {
    //     try {
    //         // Get access and refresh tokens from cookies
    //         const access_token = cookies().get('access')?.value;
    //         const refresh_token = cookies().get('refresh')?.value;
    //         console.log(cookies())
    //         console.log(access_token)
    //         console.log(refresh_token)

    //     } catch (error) { }
    // }

    // await auhenticate()

    // const fetchData = async () => {
    //     try {
    //         // const headers_ = headers();
    //         // console.log(headers_)
    //         // Create artificial delay
    //         // await new Promise(resolve => setTimeout(resolve, 5000));

    //         const response = await fetch("https://jsonplaceholder.typicode.com/posts/2");
    //         const data = await response.json();
    //         return data["body"];
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         return "";
    //     }
    // };

    return (
        <div>
            {/* <TestComponent /> */}
            {/* <h1>{await fetchData()}</h1> */}
            <LoginButton />
        </div>
    )
};

export default SSR;
