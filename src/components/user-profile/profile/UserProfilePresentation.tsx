import { motion } from 'framer-motion';
import { UserProfilePresentationProps } from '../profileTypes';
import ProfileImage from './ProfileImage';
import ProfileDetails from './ProfileDetails';
import EditForm from '../edit/EditForm';

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
		<div className='min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background to-white flex justify-center items-center'>
			{/* 상단 네비게이션 영역 */}
			{/* <div className='sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-slate-100'>
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
			</div> */}

			{/* 메인 컨테이너 */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-2xl rounded-lg shadow-md overflow-hidden relative bg-white'>
				{!isEditing && <ProfileImage user={user} t={t} />}

				<>
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
						<div>
							<ProfileDetails
								partnerName={partnerName}
								loadingPartner={loadingPartner}
								user={user}
								userData={userData}
								t={t}
								setIsEditing={setIsEditing}
							/>
						</div>
					)}
				</>
			</motion.div>
		</div>
	);
};

export default UserProfilePresentation;
