import CoupleRequestContainer from '@/components/couples/CoupleRequestContainer';
import { GetServerSideProps } from 'next';

export interface CoupleRequestPageProps {
	ogTitle: string;
	ogDescription: string;
	ogImage: string;
	ogUrl: string;
}

const CoupleRequestPage = ({
	ogTitle,
	ogDescription,
	ogImage,
	ogUrl,
}: CoupleRequestPageProps) => {
	return (
		<CoupleRequestContainer
			ogTitle={ogTitle}
			ogDescription={ogDescription}
			ogImage={ogImage}
			ogUrl={ogUrl}
		/>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const protocol = context.req.headers['x-forwarded-proto'] || 'http';
	const host = context.req.headers.host;
	const fullUrl = `${protocol}://${host}${context.req.url}`;

	const ogTitle = 'Invite Your Partner to Our Couple Web App ❤️ Ing';
	const ogDescription =
		'Join me on this special platform designed for couples to chat, share memories, and connect!';
	const ogImage = 'https://our-story-ing.vercel.app/main.jpg';
	const ogUrl = fullUrl;

	return {
		props: {
			ogTitle,
			ogDescription,
			ogImage,
			ogUrl,
		},
	};
};

export default CoupleRequestPage;
