import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
	return (
		<Html lang='en'>
			<Head>
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#FF6B6B' />
				<meta
					name='description'
					content='A private space to securely capture and share your most precious moments as a couple.'
				/>
				<link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
