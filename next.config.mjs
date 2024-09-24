import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, // Re-enable reactStrictMode if needed
	i18n: {
		locales: ['en', 'ko'],
		defaultLocale: 'ko',
		localeDetection: false,
	},
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
};

export default withPWA({
	dest: 'public',
	skipWaiting: true, // PWA-specific options here
})(nextConfig);
