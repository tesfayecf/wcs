import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    try {
        // if (request.url.includes("/api")) {
        //     console.log("Process api route");
        //     const apiResponse = await apiRequest(request);
        //     if (apiResponse.status === 401) {

        //     }
        //     const response = NextResponse.next();
        //     return response


        // } else {

        //     if (hasNoTokens(request)) return handleUnauthenticated(request);
        //     if ((await acessTokenNotValid(request))) return refreshAccessToken(request);
        //     console.log('AUTHENTICATED');
        //     return NextResponse.next();
        // }

        console.log(request.nextUrl.searchParams)
        // //check if request include rsc param
        if (request.nextUrl.searchParams.has("_rsc")) {
            console.log(request.url)
            return NextResponse.next();
        }
        // if (request.url.includes("api")) return NextResponse.next();

        const doesHaveTokens = hasTokens(request);
        console.log(doesHaveTokens)
        if (!doesHaveTokens) return handleUnauthenticated(request);
        // const isAccessTokenValid = await acessTokenValid(request)
        // if (!isAccessTokenValid) return refreshAccessToken(request);
        // console.log('AUTHENTICATED');
        return NextResponse.next();

    } catch (error) {
        console.log('AUTHENTICATION - ERROR');
        return NextResponse.error();
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|test).*)',
    ],
};

function hasTokens(request: NextRequest): boolean {
    return !!request.cookies.get('access') && !!request.cookies.get('refresh');
}

function handleUnauthenticated(request: NextRequest) {
    if (request.nextUrl.pathname !== '/login') {
        console.log("REDIRECT TO LOGIN")
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}


async function acessTokenValid(request: NextRequest): Promise<boolean> {
    try {
        console.log("VERIFY");
        const response = await verifyRequest(request);
        if (response.ok) return true;
        else return false;
    } catch (error) {
        // console.error('Error checking access token validity:', error);
        console.log("VERIFY - ERROR");
        return false;
    }
}

async function refreshAccessToken(request: NextRequest) {
    try {
        console.log("REFRESH")
        const refreshResponse = await refreshRequest(request);
        let accessToken = undefined;
        let refreshToken = undefined;
        if (refreshResponse.ok) {
            // V1
            // if (response.headers.has('set-cookie')) {
            //     const setCookieHeader = response.headers.get('set-cookie');
            //     const cookieDirectives = setCookieHeader.split(';');
            //     for (const directive of cookieDirectives) {
            //         if (directive.includes('access=')) {
            //             const parts = directive.split('=');
            //             if (parts.length === 2) {
            //                 accessToken = parts[1];
            //             } else {
            //                 throw new Error('Invalid cookie string');
            //             }
            //             break;
            //         }
            //     }
            //     if (!accessToken) throw new Error('Access token not found');
            // } else throw new Error('cookies header not found');

            // V2
            // get new access token from body acces
            const data = await refreshResponse.json();
            accessToken = data.access;
            if (!accessToken) throw new Error('Access token not found');

            // get new refresh token from body refresh
            refreshToken = request.cookies.get('refresh');
            if (!refreshToken) throw new Error('Refresh token not found');

        } else throw new Error('Error refreshing access token');

        // Refresh the acces cookie from the request(return !(!!request.cookies.get('access')) with the one returned by the response
        request.cookies.set('access', accessToken);
        request.cookies.set('refresh', refreshToken);

        const response = NextResponse.next();
        response.headers.set("set-cookie", `access=${accessToken}`);

        return response
    } catch (error) {
        console.log("REFRESH - ERROR");
        throw new Error('refreshAccessToken: ' + error);
    }
}

async function makeRequest(request: NextRequest, url: string) {
    // V1
    // const cookies = parse(request.headers.get('cookie'));
    // const headers = {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     Cookie: Object.entries({ ...cookies }).map(([key, value]) => `${key}=${value}`).join('; '),
    // };

    // return await fetch(url, {
    //     method: 'POST',
    //     headers,
    // });

    // V2
    const cookies = request.headers.get('cookie');
    const headers = new Headers(request.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('Cookie', cookies);

    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers,
        })
    } catch (e) {
        throw new Error('Fetch: ' + e);
    }
    return response;
}

async function apiRequest(request) {
    return await makeRequest(request, request.url);
}

async function refreshRequest(request) {
    const url = `${process.env.BACKEND_URL}/${process.env.REFRESH_ENDPOINT}`;
    return await makeRequest(request, url);
}

async function verifyRequest(request) {
    const url = `${process.env.BACKEND_URL}/${process.env.VERIFY_ENDPOINT}`;
    return await makeRequest(request, url);
}



