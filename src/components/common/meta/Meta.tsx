import Head from 'next/head';
import { useRouter } from 'next/router';

interface MetaProps {
	title?: string;
	description?: string;
	image?: string;
}

const Meta: React.FC<MetaProps> = ({
	title = 'Our Story Ing',
	description = '소중한 사람과의 추억을 기록할 수 있는 공간 | 포토부스',
	// image = 'https://our-story-ing.vercel.app/main.jpg',
}) => {
	const router = useRouter();
	const baseUrl = 'https://our-story-ing.vercel.app';

	return (
		<Head>
			<title>{title}</title>
			<meta name='description' content={description} />

			{/* Open Graph */}
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			{/* <meta property='og:image' content={image} /> */}
			<meta property='og:url' content={`${baseUrl}${router.asPath}`} />
			<meta property='og:type' content='website' />

			{/* Twitter */}
			{/* <meta name='twitter:card' content='summary_large_image' /> */}
		</Head>
	);
};

export default Meta;
