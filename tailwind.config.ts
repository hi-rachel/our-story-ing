import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#f472b6',
				secondary: '#f3e8ff',
				background: '#fce7f3',
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
			ringColor: {
				DEFAULT: '#FF6B6B',
			},
			ringOpacity: {
				DEFAULT: '0.5',
			},
			ringOffsetColor: {
				DEFAULT: '#FFF0F0',
			},
			ringOffsetWidth: {
				DEFAULT: '2px',
			},
		},
	},
	plugins: [],
};

export default config;
