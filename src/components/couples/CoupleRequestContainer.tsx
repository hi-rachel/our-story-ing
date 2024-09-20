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
import { CoupleRequestPageProps } from '@/pages/couple-request/[coupleRequestId]';

// Utility function for setting Open Graph metadata
const generateOGMetaTags = ({
	ogTitle,
	ogDescription,
	ogImage,
	ogUrl,
}: CoupleRequestPageProps) => (
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
);

// Utility function to check the couple request
const fetchCoupleRequest = async (
	userId: string,
	coupleRequestId: string,
	t: (key: string) => string
) => {
	const [currentUserDoc, coupleDoc] = await Promise.all([
		getDoc(doc(db, 'users', userId)),
		getDoc(doc(db, 'couples', coupleRequestId)),
	]);

	if (!currentUserDoc.exists())
		throw new Error(t('invitePartner.invalidCurrentUser'));
	if (!coupleDoc.exists())
		throw new Error(t('invitePartner.invalidOrExpiredLink'));

	return {
		currentUser: currentUserDoc.data() as UserData,
		coupleData: coupleDoc.data(),
	};
};

// Main container component
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
				const { currentUser, coupleData } = await fetchCoupleRequest(
					user.uid,
					coupleRequestId as string,
					t
				);

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

				setInviter(inviterDoc.data() as UserData);
				setCurrentUser(currentUser);

				if (currentUser.isCouple || inviterDoc.data()?.isCouple) {
					setError(t('invitePartner.alreadyInCouple'));
					setLoading(false);
				}
			} catch (err) {
				console.error('Error fetching invitation:', err);
				setError(t('invitePartner.failedToLoadInvitation'));
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
	if (error) return <ErrorPage errorMessage={error} t={t} />;

	return (
		<>
			{generateOGMetaTags({ ogTitle, ogDescription, ogImage, ogUrl })}
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
