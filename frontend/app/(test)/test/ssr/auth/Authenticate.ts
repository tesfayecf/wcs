'use server'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export const authenticate = async () => {
    const accessToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;

    // Check if it has cookies
    if (!accessToken || !refreshToken) {
        console.log("User not authenticated");
        redirect("/login");
        return false
    }

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Check access token is valid
    try {
        const headers = new Headers();
        headers.append("Cookie", `access=${accessToken};`);

        const response = await fetch('http://127.0.0.1:8000/api/auth/verify/', {
            method: "POST",
            // body: JSON.stringify({ token: accessToken }),
            credentials: 'include',
            headers: headers,
        });

        console.log("Data:", response.ok);

        if (response.ok) {
            // Access token is valid
            console.log("User authenticated");
            // return true
        } else {
            // Access token is not valid, handle accordingly
            console.log("User not authenticated");
            redirect("/login");
            // return false
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

// export const checkAuthentication = async () => {
//     const accessToken = cookies().get("access")?.value;
//     const refreshToken = cookies().get("refresh")?.value;

//     // Check if it has cookies
//     if (!accessToken || !refreshToken) {
//         return
//     }

//     console.log("Access Token:", accessToken);
//     console.log("Refresh Token:", refreshToken);

//     // Check access token is valid
//     try {
//         const headers = new Headers();
//         headers.append("Cookie", `access=${accessToken};`);

//         const response = await fetch('http://127.0.0.1:8000/api/auth/verify/', {
//             method: "POST",
//             // body: JSON.stringify({ token: accessToken }),
//             credentials: 'include',
//             headers: headers,
//         });

//         console.log("Data:", response.ok);

//         if (response.ok) {
//             // Access token is valid
//             console.log("User authenticated");
//             redirect("./authenticated");

//         } else {
//             // Access token is not valid, handle accordingly
//             console.log("User not authenticated");
//         }

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }