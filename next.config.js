/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const i18n = {
	locales: ['en', 'ko'],
	defaultLocale: 'ko',
	localeDetection: false,
};

const withPWA = require('next-pwa')({
	dest: 'public',
	register: !isDev,
	skipWaiting: true,
	disable: isDev,
});

const nextConfig = withPWA({
	reactStrictMode: true,
	i18n,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
				port: '',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				port: '',
				pathname: '**',
			},
		],
	},
});

module.exports = nextConfig;
