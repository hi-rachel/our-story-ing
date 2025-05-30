import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../../../../firebase';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	onSnapshot,
	getDoc,
	addDoc,
} from 'firebase/firestore';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

// [x] 초대시 기념일 입력 만들기

const InvitePartner: React.FC = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const [inviteLink, setInviteLink] = useState<string | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [isAccepted, setIsAccepted] = useState(false);
	const [invitationId, setInvitationId] = useState<string | null>(null);
	const [coupleId, setCoupleId] = useState<string | null>(null);

	// Listen for real-time updates to the couple request status
	useEffect(() => {
		if (invitationId) {
			const unsubscribe = onSnapshot(
				doc(db, 'couples', invitationId),
				(docSnapshot) => {
					if (docSnapshot.exists()) {
						const data = docSnapshot.data();
						if (data?.status === 'accepted') {
							setIsAccepted(true);
							toast.success(t('invitePartner.invitationAccepted'), {
								position: 'top-center',
								autoClose: 3000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								theme: 'light',
							});
						}
					}
				}
			);
			return () => unsubscribe();
		}
	}, [invitationId, t]);

	// Fetch the coupleId from the users collection for the current user
	useEffect(() => {
		const fetchCoupleId = async () => {
			const user = auth.currentUser;
			if (user) {
				try {
					const userDoc = await getDoc(doc(db, 'users', user.uid));
					if (userDoc.exists()) {
						const userData = userDoc.data();
						const coupleId = userData?.coupleId;
						if (coupleId) {
							setCoupleId(coupleId);
						}
					}
				} catch (error) {
					console.error('Error fetching coupleId:', error);
				}
			}
		};

		if (isAccepted) {
			fetchCoupleId(); // Fetch the coupleId once the invitation is accepted
		}
	}, [isAccepted, router]);

	// Function to create or retrieve the invitation link
	const handleInvite = async () => {
		setError('');
		setInviteLink(null);
		const user = auth.currentUser;
		if (!user) {
			setError(t('invitePartner.errorLogin'));
			return;
		}
		setLoading(true);
		try {
			const couplesRef = collection(db, 'couples');
			const q = query(
				couplesRef,
				where('inviterId', '==', user.uid),
				where('status', '==', 'pending')
			);

			const querySnapshot = await getDocs(q);

			// If there's already a pending invitation, use the existing one
			if (!querySnapshot.empty) {
				const existingDoc = querySnapshot.docs[0];
				const invitationLink = `${window.location.origin}/couple-request/${existingDoc.id}`;
				setInviteLink(invitationLink);
				setInvitationId(existingDoc.id); // Store invitationId
			} else {
				// Otherwise, create a new couple request
				const docRef = await addDoc(couplesRef, {
					inviterId: user.uid,
					inviterEmail: user.email,
					createdAt: new Date(),
					status: 'pending',
				});
				const invitationLink = `${window.location.origin}/couple-request/${docRef.id}`;
				setInviteLink(invitationLink);
				setInvitationId(docRef.id); // Store invitationId
			}
		} catch (err) {
			console.error('Error creating or finding invitation:', err);
			setError(t('invitePartner.errorGeneratingInvite'));
		} finally {
			setLoading(false);
		}
	};

	const handleClickCopyLink = async (link: string) => {
		if (link) {
			try {
				await navigator.clipboard.writeText(link.toString());
				toast.success(t('invitePartner.linkCopied'), {
					position: 'top-center',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			} catch (copyError) {
				toast.error(t('invitePartner.errorCopying'), {
					position: 'top-center',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
				console.error('Error copying link:', copyError);
			}
		}
	};

	const handleGoToCoupleChat = () => {
		router.push(`/couple-chat/${coupleId}`);
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-surface-light to-surface p-4'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white shadow-card rounded-large p-8'>
				<h2 className='text-3xl font-heading font-semibold mb-6 text-center text-primary'>
					{isAccepted ? t('invitePartner.accepted') : t('invitePartner.title')}
				</h2>

				{error && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-error mb-4 text-center'>
						{error}
					</motion.p>
				)}

				{!isAccepted && (
					<motion.button
						onClick={handleInvite}
						className='w-full p-4 bg-gradient-to-r from-accent to-primary  text-white rounded-large font-bold text-lg shadow-button transition-colors duration-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						disabled={loading || isAccepted}>
						{loading ? (
							<motion.span
								animate={{ rotate: 360 }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'linear',
								}}>
								🔄
							</motion.span>
						) : (
							t('invitePartner.generateInviteButton')
						)}
					</motion.button>
				)}

				{inviteLink && !isAccepted && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className='mt-6'>
						<p className='text-success text-center mb-4'>
							{t('invitePartner.inviteLinkGenerated')}
						</p>
						<p className='text-center mb-4'>{t('invitePartner.shareLink')}</p>
						<div className='bg-gray-100 p-4 rounded-md break-all text-center mb-4'>
							<span className='text-blue-500'>{inviteLink}</span>
						</div>
						<motion.button
							className='w-full p-3 bg-accent text-white rounded-large font-bold shadow-button transition-colors duration-300'
							onClick={() => handleClickCopyLink(inviteLink)}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							{t('invitePartner.copyLinkButton')}
						</motion.button>
					</motion.div>
				)}

				{isAccepted && (
					<motion.button
						onClick={() => handleGoToCoupleChat()}
						className='w-full p-4 bg-gradient-to-r from-accent to-primary text-white rounded-large font-bold text-lg shadow-button transition-colors duration-300 mt-6'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						{t('invitePartner.goToChat')}
					</motion.button>
				)}
			</motion.div>
		</div>
	);
};

export default InvitePartner;
