import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProfileDetailsProps } from '../profileTypes';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { motion } from 'framer-motion';
import {
	FaCalendarAlt,
	FaEnvelope,
	FaHeart,
	FaInfoCircle,
	FaUser,
} from 'react-icons/fa';

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
	partnerName,
	loadingPartner,
	user,
	userData,
	t,
}) => {
	const router = useRouter();
	const [anniversary, setAnniversary] = useState<string | null>(null); // 기념일 상태 추가
	const [loadingAnniversary, setLoadingAnniversary] =
		useState<boolean>(false);

	// 기념일 정보 가져오기
	useEffect(() => {
		const fetchAnniversary = async () => {
			if (userData.coupleId) {
				setLoadingAnniversary(true);
				try {
					const coupleDoc = await getDoc(
						doc(db, 'couples', userData.coupleId)
					);
					if (coupleDoc.exists()) {
						const coupleData = coupleDoc.data();
						if (coupleData && coupleData.anniversary) {
							setAnniversary(coupleData.anniversary);
						} else {
							setAnniversary(null);
						}
					}
				} catch (error) {
					setAnniversary(null);
				} finally {
					setLoadingAnniversary(false);
				}
			}
		};

		if (userData.coupleId) {
			fetchAnniversary();
		}
	}, [userData.coupleId]);

	const handleGoToInvitePartner = () => {
		router.push('/invite');
	};

	const handleGoToCoupleChat = () => {
		router.push(`/couple-chat/${userData.coupleId}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='space-y-6'>
			<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
				<div className='px-4 py-5 sm:p-6'>
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
						{/* Personal Info */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}>
							<h3 className='text-xl font-semibold leading-6 text-primary mb-4'>
								{t('profile.personalInfo')}
							</h3>
							<div className='space-y-4'>
								<div className='flex items-center'>
									<FaUser className='text-primary mr-2' />
									<div>
										<dt className='text-sm font-medium text-gray-500'>
											{t('profile.name')}
										</dt>
										<dd className='mt-1 text-sm text-gray-900'>
											{user.displayName}
										</dd>
									</div>
								</div>
								<div className='flex items-center'>
									<FaEnvelope className='text-primary mr-2' />
									<div>
										<dt className='text-sm font-medium text-gray-500'>
											{t('profile.email')}
										</dt>
										<dd className='mt-1 text-sm text-gray-900'>
											{user.email}
										</dd>
									</div>
								</div>
								<div className='flex items-center'>
									<FaInfoCircle className='text-primary mr-2' />
									<div>
										<dt className='text-sm font-medium text-gray-500'>
											{t('profile.bio')}
										</dt>
										<dd className='mt-1 text-sm text-gray-900'>
											{userData.profileMessage ||
												t('profile.noBio')}
										</dd>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Couple Info */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}>
							<h3 className='text-xl font-semibold leading-6 text-primary mb-4'>
								{t('profile.coupleInfo')}
							</h3>
							<div className='space-y-4'>
								<div className='flex items-center'>
									<FaHeart className='text-primary mr-2' />
									<div>
										<dt className='text-sm font-medium text-gray-500'>
											{t('profile.partner')}
										</dt>
										<dd className='mt-1 text-sm text-gray-900'>
											{loadingPartner ? (
												<span>
													{t(
														'profile.loadingPartner'
													)}
												</span>
											) : userData.partnerId ? (
												partnerName
											) : (
												t('profile.single')
											)}
										</dd>
									</div>
								</div>
								{partnerName && (
									<div className='flex items-center'>
										<FaCalendarAlt className='text-primary mr-2' />
										<div>
											<dt className='text-sm font-medium text-gray-500'>
												{t('profile.anniversary')}
											</dt>
											<dd className='mt-1 text-sm text-gray-900'>
												{loadingAnniversary ? (
													<span>
														{t(
															'profile.loadingAnniversary'
														)}
													</span>
												) : anniversary ? (
													anniversary
												) : (
													t('profile.noAnniversary')
												)}
											</dd>
										</div>
									</div>
								)}
							</div>
							{userData.isCouple ? (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className='mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
									onClick={handleGoToCoupleChat}>
									{t('profile.goToChat')}
								</motion.button>
							) : (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className='mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'
									onClick={handleGoToInvitePartner}>
									{t('profile.invitePartner')}
								</motion.button>
							)}
						</motion.div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default ProfileDetails;
