// import React from 'react';
// import { GetServerSideProps, GetServerSidePropsContext } from 'next';
// import { useRouter } from 'next/router';
// import RequestManager from '../api/requestManager';
// import AppHandler from '@/app/app/AppHandler';
// import LoadingPage from '@/app/components/loadingPage/LoadingPage';
// import axios, { AxiosResponse } from 'axios';

// const Authenticate: React.FunctionComponent = (props) => {
//     // const router = useRouter();
  
//     // Render a loading page while the server-side props are being fetched
//     return <LoadingPage />;
// };
  
// export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
//     const { req } = context;
//     console.log(req.cookies)
//     const requestManager = RequestManager.getInstance();
//     const appHandler = AppHandler.getInstance();
//     console.log("apdfasdf")

//     try {
//         const request_api = axios.create({
//             baseURL: `${"http"}://${"127.0.0.1"}:${"8000"}`,
//             withCredentials: true,
//             headers: {
//                 common: {
//                     "Content-Type": "application/json",
//                     Accept: "application/json",
//                 },

//             },
//         });

//         const response: AxiosResponse = await request_api.request({
//             method: "POST",
//             url: `/${"verify"}`,
//             data: {},
//             headers: {
//                 Authorization: `Bearer ${req.headers['authorization']}`,
//                 Cookie: req.headers['cookie'],
//             },
//             withCredentials: true,
//         });

//         const isSuccess = status !== undefined && response.status >= 200 && response.status < 300;

//         if (isSuccess) {
//             // If authentication is successful, set the authentication status and fetch user info
//             // appHandler.setAuth();
//             // appHandler.getUserInfo();

//             // Redirect the user to the desired page
//             return {
//                 redirect: {
//                 destination: '/dashboard',
//                 permanent: false,
//                 },
//             };
//         } else {
//             // If authentication fails, log an error in the development environment
//             if (process.env.NODE_ENV === 'development') {
//                 console.log('Auth failed');
//             }
//         }
//     } catch (error) {
//         // Handle any errors that occur during the server call
//         if (process.env.NODE_ENV === 'development') {
//             console.error('Error:', error);
//         }
//     }

//     // If the server call fails or authentication fails, redirect the user to the login page
//     return {
//         redirect: {
//         destination: '/login',
//         permanent: false,
//         },
//     };
// };
  
// export default Authenticate;

'use client';
import React from 'react';
import RequestManager from '../api/requestManager';
import AppHandler from '@/app/app/AppHandler'


const requestManager = RequestManager.getInstance();
const appHandler = AppHandler.getInstance();

export default function Authenticate() {
    React.useEffect(() => {
        const verify = async () => {
            return await requestManager.request("auth", "verify", []);
        }
        verify().then((response) => {
            if (response.isSuccess) {
                appHandler.setAuth();
                appHandler.getUserInfo();
            } else {
                if (process.env.NODE_ENV === "development") console.log("Auth failed");
            }
        }).finally(() => {
            appHandler.finishInitialLoad();
        })
    }, []);

    return null;
}