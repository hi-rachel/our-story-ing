import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
	return (
		<Html lang='en'>
			<Head>
				<link rel='manifest' href='/manifest.json' />
				<link
					rel='stylesheet'
					as='style'
					crossOrigin='anonymous'
					href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css'
				/>
				<meta name='theme-color' content='#f472b6' />
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='소중한 사람과의 추억을 기록할 수 있는 공간 | 포토부스'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
