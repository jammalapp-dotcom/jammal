/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@jammal/shared'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jammal-uploads.s3.me-south-1.amazonaws.com',
            },
        ],
    },
};

module.exports = nextConfig;
