import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#FF6B6B',
				secondary: '#FFD3D3',
				background: '#FFF0F0',
				text: '#4A4A4A',
				accent: '#FF9999',
				success: '#4CAF50',
				error: '#F44336',
			},
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
				heading: ['Poppins', 'sans-serif'],
			},
			fontSize: {
				h1: ['2.5rem', { lineHeight: '3rem' }],
				h2: ['2rem', { lineHeight: '2.5rem' }],
				h3: ['1.75rem', { lineHeight: '2.25rem' }],
				p: ['1rem', { lineHeight: '1.6rem' }],
				small: ['0.875rem', { lineHeight: '1.25rem' }],
			},
			boxShadow: {
				card: '0 4px 6px rgba(0, 0, 0, 0.1)',
				button: '0 2px 4px rgba(0, 0, 0, 0.1)',
			},
			borderRadius: {
				default: '8px',
				large: '12px',
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'spin-fast': 'spin 0.5s linear infinite',
			},
		},
	},
	plugins: [],
};

export default config;
