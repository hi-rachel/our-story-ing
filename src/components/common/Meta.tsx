import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface MetaProps {
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogUrl?: string;
}

const Meta: React.FC<MetaProps> = ({
	ogTitle = 'Welcome to Our Couple Web App ❤️ Ing',
	ogDescription = 'Join this special platform for couples to chat, share memories, and connect!',
	ogImage = 'https://our-story-ing.vercel.app/main.jpg',
	ogUrl = 'https://our-story-ing.vercel.app',
}) => {
	const router = useRouter();
	const { i18n } = useTranslation();

	const defaultOgUrl =
		ogUrl || `https://our-story-ing.vercel.app${router.asPath}`;

	const localizedTitle =
		i18n.language === 'ko'
			? '커플 웹앱에 오신 것을 환영합니다 ❤️ Ing'
			: ogTitle;

	const localizedDescription =
		i18n.language === 'ko'
			? '채팅하고, 추억을 공유하며 소통할 수 있는 특별한 커플 플랫폼에 함께하세요!'
			: ogDescription;

	return (
		<Head>
			<meta property='og:title' content={localizedTitle} />
			<meta property='og:description' content={localizedDescription} />
			<meta property='og:image' content={ogImage} />
			<meta property='og:url' content={defaultOgUrl} />
			<meta property='og:type' content='website' />
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={localizedTitle} />
			<meta name='twitter:description' content={localizedDescription} />
			<meta name='twitter:image' content={ogImage} />
		</Head>
	);
};

export default Meta;
