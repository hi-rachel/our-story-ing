import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
	return (
		<Html lang='en'>
			<Head>
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#f472b6' />
				<meta
					name='description'
					content='커플들이 자신들의 여정을 공유할 수 있는 특별한 공간'
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
