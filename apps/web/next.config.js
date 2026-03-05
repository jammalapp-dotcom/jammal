/** @type {import('next').NextConfig} */
const nextConfig = {
    // تمكين transpile للحزم المشتركة
    transpilePackages: ['@jammal/shared', '@jammal/ui', '@jammal/api'],

    // إعدادت الصور
    images: {
        domains: ['kfzoouifwtubmsbtktyy.supabase.co'],
    },
};

module.exports = nextConfig;
