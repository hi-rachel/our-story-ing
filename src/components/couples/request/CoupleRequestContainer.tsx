import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { UserData } from '@/types/user';
import { User } from 'firebase/auth';
import CoupleRequestPresentation from './CoupleRequestPresentation';
import { useTranslation } from 'next-i18next';
import ErrorPage from '@/pages/error';

const CoupleRequestContainer = () => {
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
				const currentUserRef = doc(db, 'users', user.uid);

				// Update the couple status to 'accepted' and connect the two users
				transaction.update(coupleRef, {
					status: 'accepted',
					partnerId: user.uid,
					acceptedAt: new Date(),
				});

				transaction.update(inviterRef, {
					isCouple: true,
					coupleId: coupleRequestId,
					partnerId: user.uid,
				});

				transaction.update(currentUserRef, {
					isCouple: true,
					coupleId: coupleRequestId,
					partnerId: inviter.userId,
				});
			});

			// Once the couple is connected, redirect to the anniversary input page
			router.push(`/couple-anniversary/${coupleRequestId}`);
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
		<CoupleRequestPresentation
			inviter={inviter}
			error={error}
			loading={loading}
			onAcceptInvitation={acceptInvitation}
			t={t}
		/>
	);
};

export default CoupleRequestContainer;
