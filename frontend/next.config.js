/** @type {import('next').NextConfig} */
path = require("path");

const nextConfig = {
    parameters: {
        nextjs: {
            appDirectory: true,
        },
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
