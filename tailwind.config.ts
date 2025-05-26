import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					light: '#fda4cf', // 더 밝은 핑크
					DEFAULT: '#f472b6', // 현재 핑크
					dark: '#fb3fac', // 더 진한 핑크
				},
				secondary: '#FB7185',
				background: '#fce7f3', // 연한 핑크
				text: '#4A4A4A', // 메인 텍스트
				accent: {
					light: '#f4bffc',
					DEFAULT: '#e879f9',
					dark: '#db32f5',
					foreground: 'hsl(var(--accent-foreground))',
				},
				muted: '#9ca3af', // 부가 텍스트
				surface: {
					light: '#fce7f3', // 가장 연한 배경
					DEFAULT: '#f3e8ff', // 메인 배경
					dark: '', // 약간 진한 배경
				},
				success: '#2ec169',
				error: '#FF5F49',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
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
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'spin-fast': 'spin 0.5s linear infinite',
				'bounce-slow': 'bounce 2s infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')],
};

export default config;
