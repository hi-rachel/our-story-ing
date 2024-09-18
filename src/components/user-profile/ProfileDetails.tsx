import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProfileDetailsProps } from './profileTypes';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { motion } from 'framer-motion';

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
	user,
	userData,
	t,
	handleCoupleUnlink,
}) => {
	const router = useRouter();
	const [partnerName, setPartnerName] = useState<string | null>(null);
	const [loadingPartner, setLoadingPartner] = useState<boolean>(false);

	useEffect(() => {
		const fetchPartnerName = async () => {
			if (userData.partnerId) {
				setLoadingPartner(true);
				try {
					const partnerDoc = await getDoc(
						doc(db, 'users', userData.partnerId)
					);
					if (partnerDoc.exists()) {
						const partnerData = partnerDoc.data();
						if (partnerData && partnerData.displayName) {
							setPartnerName(partnerData.displayName);
						} else {
							console.warn(
								'No displayName found in partner document'
							);
							setPartnerName('Unknown Partner');
						}
					} else {
						console.error(
							'No document found for partner ID:',
							userData.partnerId
						);
						setPartnerName(null);
					}
				} catch (error) {
					console.error('Error fetching partner document:', error);
					setPartnerName(null);
				} finally {
					setLoadingPartner(false);
				}
			}
		};

		if (userData.isCouple && userData.partnerId) {
			fetchPartnerName();
		}
	}, [userData.isCouple, userData.partnerId]);

	const handleGoToInvitePartner = () => {
		router.push('/invite');
	};

	return (
		<div className='space-y-6'>
			<div className='bg-white shadow rounded-lg overflow-hidden'>
				<div className='px-4 py-5 sm:p-6'>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div>
							<h3 className='text-lg font-medium leading-6 text-gray-900'>
								{t('profile.personalInfo')}
							</h3>
							<div className='mt-5 space-y-4'>
								<div>
									<dt className='text-sm font-medium text-gray-500'>
										{t('profile.name')}
									</dt>
									<dd className='mt-1 text-sm text-gray-900'>
										{user.displayName}
									</dd>
								</div>
								<div>
									<dt className='text-sm font-medium text-gray-500'>
										{t('profile.email')}
									</dt>
									<dd className='mt-1 text-sm text-gray-900'>
										{user.email}
									</dd>
								</div>
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
						<div>
							<h3 className='text-lg font-medium leading-6 text-gray-900'>
								{t('profile.coupleInfo')}
							</h3>
							<div className='mt-5 space-y-4'>
								<div>
									<dt className='text-sm font-medium text-gray-500'>
										{t('profile.partner')}
									</dt>
									<dd className='mt-1 text-sm text-gray-900'>
										{loadingPartner ? (
											<span>
												{t('profile.loadingPartner')}
											</span>
										) : userData.partnerId ? (
											partnerName
										) : (
											t('profile.single')
										)}
									</dd>
								</div>
								<div className='mt-6'>
									{userData.isCouple ? (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
											onClick={handleCoupleUnlink}>
											{t('profile.unlinkCouple')}
										</motion.button>
									) : (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
											onClick={handleGoToInvitePartner}>
											{t('profile.linkCouple')}
										</motion.button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileDetails;
