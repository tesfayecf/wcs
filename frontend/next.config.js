/** @type {import('next').NextConfig} */
path = require("path");

const nextConfig = {
    experimental: {
        appDir: true,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
