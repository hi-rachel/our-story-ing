import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#f472b6', // 핑크 (포인트 컬러)
				secondary: '#FB7185',
				background: '#fce7f3', // 연한 핑크
				text: '#4A4A4A', // 메인 텍스트
				accent: {
					light: '#f4bffc',
					DEFAULT: '#e879f9',
					dark: '#db32f5',
				},
				muted: '#9ca3af', // 부가 텍스트
				surface: {
					light: '#fce7f3', // 가장 연한 배경
					DEFAULT: '#f3e8ff', // 메인 배경
					dark: '', // 약간 진한 배경
				},
				success: '#2ec169',
				error: '#FF5F49',
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
				'bounce-slow': 'bounce 2s infinite',
			},
		},
	},
	plugins: [],
};

export default config;

// const config: Config = {
// 	content: [
// 		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
// 		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
// 	],
// 	theme: {
// 		extend: {
// 			colors: {
// 				primary: {
// 					light: '#FFE4E6', // 매우 연한 핑크
// 					DEFAULT: '#FDA4AF', // 메인 핑크
// 					dark: '#FB7185', // 진한 핑크
// 				},
// 				secondary: {
// 					light: '#FFF1F2', // 매우 연한 로즈
// 					DEFAULT: '#FFE4E6', // 메인 로즈
// 					dark: '#FDA4AF', // 진한 로즈
// 				},
// 				background: {
// 					light: '#FFF5F5', // 매우 연한 배경
// 					DEFAULT: '#FFF1F2', // 메인 배경
// 					dark: '#FFE4E6', // 진한 배경
// 				},
// 				text: {
// 					primary: '#334155', // 메인 텍스트
// 					secondary: '#64748B', // 보조 텍스트
// 					muted: '#94A3B8', // 흐린 텍스트
// 				},
// 				accent: {
// 					light: '#FDA4AF', // 연한 액센트
// 					DEFAULT: '#FB7185', // 메인 액센트
// 					dark: '#F43F5E', // 진한 액센트
// 				},
// 				success: '#10B981', // 성공
// 				error: '#EF4444', // 에러
// 			},
// 			fontFamily: {
// 				sans: ['Roboto', 'sans-serif'],
// 				heading: ['Poppins', 'sans-serif'],
// 			},
// 			boxShadow: {
// 				card: '0 4px 6px rgba(0, 0, 0, 0.05)',
// 				button: '0 2px 4px rgba(0, 0, 0, 0.05)',
// 				'card-hover': '0 8px 12px rgba(0, 0, 0, 0.1)',
// 			},
// 			borderRadius: {
// 				default: '12px',
// 				large: '16px',
// 			},
// 		},
// 	},
// 	plugins: [],
// };

// export default config;
