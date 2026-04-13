/** @type {import('next').NextConfig} */
const nextConfig = {
    // تمكين transpile للحزم المشتركة
    transpilePackages: ['@jammal/shared', '@jammal/ui', '@jammal/api'],

    // Static Export for Hostinger
    output: 'export',
    trailingSlash: true,

    // إعدادات الصور - unoptimized for static export
    images: {
        domains: ['kfzoouifwtubmsbtktyy.supabase.co'],
        unoptimized: true,
    },
};

module.exports = nextConfig;
