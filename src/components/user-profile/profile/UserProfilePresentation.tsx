import { motion } from 'framer-motion';
import { UserProfilePresentationProps } from '../profileTypes';
import ProfileImage from './ProfileImage';
import ProfileDetails from './ProfileDetails';
import EditForm from '../edit/EditForm';
import EditAccountButton from '../edit/EditAccountButton';
import BackButton from '@/components/common/button/BackButton';

const UserProfilePresentation: React.FC<UserProfilePresentationProps> = ({
	user,
	userData,
	partnerName,
	loadingPartner,
	isEditing,
	editedUser,
	t,
	setIsEditing,
	handleInputChange,
	handleSubmit,
	handleDeleteAccount,
	handleImageDelete,
	handleImageUpload,
	handleCoupleUnlink,
	handleAnniversaryChange,
}) => {
	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-white'>
			{/* 상단 네비게이션 영역 */}
			<div className='sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-slate-100'>
				<div className='max-w-7xl mx-auto'>
					<div className='relative flex items-center h-14'>
						<div className='absolute left-2'>
							<BackButton />
						</div>
						<div className='flex-1 flex justify-center'>
							<h1 className='text-lg font-bold text-primary'>
								{t('profile.title')}
							</h1>
						</div>
					</div>
				</div>
			</div>

			{/* 메인 컨테이너 */}
			<div className='flex justify-center items-center px-4 sm:px-6 lg:px-8 pt-6 min-h-[calc(100vh-3.5rem)]'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='w-full max-w-2xl bg-white rounded-lg shadow-card overflow-hidden relative'>
					{!isEditing && <ProfileImage user={user} t={t} />}

					<div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
						{isEditing ? (
							<EditForm
								partnerName={partnerName}
								loadingPartner={loadingPartner}
								editedUser={editedUser}
								handleInputChange={handleInputChange}
								handleSubmit={handleSubmit}
								t={t}
								setIsEditing={setIsEditing}
								handleImageDelete={handleImageDelete}
								handleImageUpload={handleImageUpload}
								handleAnniversaryChange={handleAnniversaryChange}
								handleCoupleUnlink={handleCoupleUnlink}
								handleDeleteAccount={handleDeleteAccount}
							/>
						) : (
							<>
								<ProfileDetails
									partnerName={partnerName}
									loadingPartner={loadingPartner}
									user={user}
									userData={userData}
									t={t}
								/>

								<div className='flex justify-end p-4'>
									<EditAccountButton setIsEditing={setIsEditing} t={t} />
								</div>
							</>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default UserProfilePresentation;
