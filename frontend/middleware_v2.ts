import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    try {
        console.log("Request received:", request.url)

        // If request is not signup or login, check credentials
        if (!request.url.includes("/signup") && !request.url.includes("/login") && !request.url.includes("/api")) {
            console.log("Authenticate page route");
            // const authentication = await authenticateRequest(request);
            const authentication = true;
            if (authentication) {
                console.log("Authentication successful");
                return NextResponse.next();
            } else {
                console.log("Authentication failed");
                const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
                redirectResponse.cookies.set('redirected', 'true');
                return redirectResponse; // Return the response from the redirected request
            }
        }

        // If request is login page
        if (request.url.includes("/login") && !request.url.includes("/api")) {
            console.log("Process login page");
            // const authentication = await authenticateRequest(request);
            const authentication = false;
            if (!authentication) {
                console.log("Authentication failed");
                return NextResponse.next();
            } else {
                console.log("Authentication successful");
                const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
                redirectResponse.cookies.set('redirected', 'true');
                return redirectResponse; // Return the response from the redirected request
            }
        }

        // If request is to api
        if (request.url.includes("/api")) {
            console.log("Process api route");
            const apiResponse = await redirectRequest(request);
            return apiResponse; // Return the response from the redirected request
        }

        // Otherwise
        return NextResponse.next();

    } catch (error) {
        console.error('MIDDLEWARE - ERROR:', error); // Log the specific error for debugging
        return NextResponse.error(); // Provide a generic error message to the client
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|_next/chunks|favicon.ico|test).*)',
    ],
};

async function redirectRequest(request: NextRequest) {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
        throw new Error('Backend URL is not configured.');
    }

    const headers = new Headers(request.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // Manually manage cookies in headers if necessary
    const cookies = request.cookies;
    if (cookies) {
        headers.append('Cookie', Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; '));
    }

    console.log(headers)

    let response;
    try {
        response = await fetch(
            backendUrl + request.nextUrl.pathname, {
            method: request.method,
            headers,
            body: request.body,
        }
        );

        console.log(response)

        // Extracting cookies from the response headers
        const cookies = response.headers.get('set-cookie');
        const cookieHeader = cookies ? cookies.split(';')[0] : '';

        console.log(cookieHeader)

        // Constructing NextResponse with cookies
        const serverResponse = new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...response.headers,
                'set-cookie': cookieHeader // Adding cookies to the response headers
            },
        });

        return serverResponse;
    } catch (error) {
        console.error('Fetch Error:', error);
        return NextResponse.error();
        // throw new Error('Failed to fetch data from the backend server.');
    }
}

