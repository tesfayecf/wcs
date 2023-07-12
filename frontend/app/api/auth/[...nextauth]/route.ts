import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import jwt_decode from "jwt-decode";s
// import { TokenInfo } from "../../../components/types/auth_types";


async function refreshAccessToken(token: any) {
    try {
        console.log("BUT WHY?");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
            {
                method: "POST",
                body: JSON.stringify({ refresh: token.refreshToken }),
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!res.ok) throw "refreshError";
        const responseJson = await res.json();
        return {
            ...token,
            accessToken: responseJson.access,
        }

    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const userCredentials = {
                    email: credentials?.email, password: credentials?.password
                };
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
                        {
                            method: "POST",
                            body: JSON.stringify(userCredentials),
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                        }
                    );
                    console.log("res", res);
                    if (res.ok) {
                        const responseJson = await res.json();
                        console.log("resJson", responseJson);
                        // const tokenInfo: TokenInfo = jwt_decode(responseJson.access);
                        // console.log("tokenInfo", tokenInfo);
                        // return {
                        //     id: tokenInfo.user_id.toString(),
                        //     email: tokenInfo.email,
                        //     firstName: tokenInfo.first_name,
                        //     lastName: tokenInfo.last_name,
                        //     isStaff: tokenInfo.is_staff,
                        //     accessToken: responseJson.access,
                        //     refreshToken: responseJson.refresh,
                        // };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        // async jwt({ token, account, user }) {
        //     if (account && user) {
        //         console.log("got into token", user);

        //         token.firstName = user.firstName;
        //         token.lastName = user.lastName;
        //         token.refreshToken = user.refreshToken;
        //         token.accessToken = user.accessToken;
        //     }
        //     if (token.accessToken) {
        //         console.log("got in this if instead")
        //         const decodedToken: TokenInfo = jwt_decode(token.accessToken);
        //         if (Date.now() < decodedToken.exp * 1000) {
        //             console.log("got here, returned properly");
        //             return token;
        //         }
        //     }
        //     console.log("got here, not properly, why?");
        //     return await refreshAccessToken(token);
        // },
        // async session({ session, token }) {
        //     console.log("getting session");
        //     session.user.firstName = token.firstName;
        //     session.user.lastName = token.lastName;
        //     session.accessToken = token.accessToken;
        //     console.log("sess", session);
        //     return session;
        // }
    },
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        maxAge: 1 * 24 * 60 * 60,  // two days
    }
};

export default NextAuth(authOptions);