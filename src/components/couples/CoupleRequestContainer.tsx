import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../../firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { UserData } from '@/types/user';
import { User } from 'firebase/auth';
import CoupleRequestPresentation from './CoupleRequestPresentation';
import { useTranslation } from 'next-i18next';
import ErrorPage from '@/components/common/ErrorPage';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

interface CoupleRequestPageProps {
	ogTitle: string;
	ogDescription: string;
	ogImage: string;
	ogUrl: string;
}

export const getServerSideProps: GetServerSideProps<
	CoupleRequestPageProps
> = async (context) => {
	const { locale, req } = context;
	const protocol = req.headers['x-forwarded-proto'] || 'https'; // Production에서 'x-forwarded-proto'를 사용하고, 로컬에서는 'https'
	const host = req.headers.host;
	const urlPath = context.resolvedUrl; // 현재 URL 경로를 가져옴

	const ogTitle =
		locale === 'ko'
			? '커플 웹앱에 초대하세요 ❤️ Ing'
			: 'Invite Your Partner to Our Couple Web App ❤️ Ing';
	const ogDescription =
		locale === 'ko'
			? '커플을 위한 특별한 플랫폼에 함께하세요! 채팅하고 추억을 공유하고 소통할 수 있어요!'
			: 'Join me on this special platform designed for couples to chat, share memories, and connect!';
	const ogImage = 'https://our-story-ing.vercel.app/main.jpg';
	const ogUrl = `${protocol}://${host}${urlPath}`; // 현재 URL 생성

	return {
		props: {
			ogTitle,
			ogDescription,
			ogImage,
			ogUrl,
		},
	};
};

const CoupleRequestContainer: React.FC<CoupleRequestPageProps> = ({
	ogTitle,
	ogDescription,
	ogImage,
	ogUrl,
}) => {
	const router = useRouter();
	const { t } = useTranslation();
	const { coupleRequestId } = router.query;
	const [inviter, setInviter] = useState<UserData | null>(null);
	const [currentUser, setCurrentUser] = useState<UserData | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkCoupleRequest = async () => {
			const user = auth.currentUser as User | null;
			if (!user || !coupleRequestId) {
				setError(t('invitePartner.invalidRequest'));
				setLoading(false);
				return;
			}

			try {
				const [currentUserDoc, coupleDoc] = await Promise.all([
					getDoc(doc(db, 'users', user.uid)),
					getDoc(doc(db, 'couples', coupleRequestId as string)),
				]);

				if (!currentUserDoc.exists()) {
					setError(t('invitePartner.invalidCurrentUser'));
					setLoading(false);
					return;
				}
				const currentUserData = currentUserDoc.data() as UserData;
				setCurrentUser(currentUserData);

				if (!coupleDoc.exists()) {
					setError(t('invitePartner.invalidOrExpiredLink'));
					setLoading(false);
					return;
				}

				const coupleData = coupleDoc.data();
				const inviterId = coupleData.inviterId;

				if (inviterId === user.uid) {
					setError(t('invitePartner.cannotInviteYourself'));
					setLoading(false);
					return;
				}

				const inviterDoc = await getDoc(doc(db, 'users', inviterId));
				if (!inviterDoc.exists()) {
					setError(t('invitePartner.invalidInviter'));
					setLoading(false);
					return;
				}

				const inviterData = inviterDoc.data() as UserData;
				setInviter(inviterData);

				if (currentUserData.isCouple) {
					setError(t('invitePartner.alreadyInCouple'));
					setLoading(false);
					return;
				}

				if (inviterData.isCouple) {
					setError(t('invitePartner.alreadyInCouple'));
					setLoading(false);
					return;
				}
			} catch (err) {
				console.error('Error fetching invitation:', err);
				setError(t('invitePartner.failedToLoadInvitation'));
			} finally {
				setLoading(false);
			}
		};

		checkCoupleRequest();
	}, [coupleRequestId, t]);

	const acceptInvitation = async () => {
		const user = auth.currentUser as User;
		if (!user || !inviter || !currentUser) return;

		try {
			await runTransaction(db, async (transaction) => {
				const coupleRef = doc(db, 'couples', coupleRequestId as string);
				const inviterRef = doc(db, 'users', inviter.userId);
				const currentUserRef = doc(db, 'users', currentUser.userId);

				transaction.update(coupleRef, {
					status: 'accepted',
					partnerId: currentUser.userId,
					acceptedAt: new Date(),
				});

				transaction.update(inviterRef, {
					isCouple: true,
					coupleId: coupleRequestId,
					partnerId: currentUser.userId,
				});

				transaction.update(currentUserRef, {
					isCouple: true,
					coupleId: coupleRequestId,
					partnerId: inviter.userId,
				});
			});

			router.push(`/couple-chat/${coupleRequestId}`);
		} catch (err) {
			console.error('Error accepting invitation:', err);
			setError(t('invitePartner.failedToAcceptInvitation'));
		}
	};

	if (loading) return <div>{t('common.loading')}</div>;

	if (error) {
		return <ErrorPage errorMessage={error} t={t} />;
	}

	return (
		<>
			<Head>
				<meta property='og:title' content={ogTitle} />
				<meta property='og:description' content={ogDescription} />
				<meta property='og:image' content={ogImage} />
				<meta property='og:url' content={ogUrl} />
				<meta property='og:type' content='website' />
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content={ogTitle} />
				<meta name='twitter:description' content={ogDescription} />
				<meta name='twitter:image' content={ogImage} />
			</Head>
			<CoupleRequestPresentation
				inviter={inviter}
				error={error}
				loading={loading}
				onAcceptInvitation={acceptInvitation}
				t={t}
			/>
		</>
	);
};

export default CoupleRequestContainer;
