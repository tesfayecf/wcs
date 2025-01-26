
interface CookieAttributes {
    expires?: string;
    'max-age'?: string;
    path?: string;
    samesite?: string;
    httponly?: boolean; // You can add more attributes as needed
    [key: string]: string | boolean | undefined; // For additional attributes that may not be defined
}

interface ParsedCookie {
    value: string;
    attributes: CookieAttributes;
}

interface ParsedCookies {
    [name: string]: ParsedCookie;
}

export function parseCookies(setCookieHeader: string): ParsedCookies {
    const cookies: ParsedCookies = {};

    // Split the cookies by comma, considering that some attributes may contain commas.
    const cookiePairs = setCookieHeader.split(/,(?=\s*\w+=)/); // Split on commas but ignore commas within cookie attributes

    cookiePairs.forEach(cookiePair => {
        // Split cookie name and value from attributes
        const [cookie, ...attributes] = cookiePair.split(';').map(attr => attr.trim());

        // Extract the cookie name and value
        const [name, value] = cookie.split('=');

        // Prepare attributes object
        const cookieAttributes: CookieAttributes = {};

        attributes.forEach(attr => {
            const [key, val] = attr.split('=').map(item => item.trim());
            cookieAttributes[key.toLowerCase()] = val !== undefined ? val : true; // Store true if the attribute has no value
        });

        // Add the cookie to the cookies object
        cookies[name] = {
            value,
            attributes: cookieAttributes
        };
    });

    return cookies;
}