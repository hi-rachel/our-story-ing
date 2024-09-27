import { ProfileImageProps } from '../profileTypes';
import DefaultProfile from '@/components/common/profile/DefaultProfile';

const ProfileImage: React.FC<ProfileImageProps> = ({ user, t }) => (
	<div className='py-4 sm:py-5 px-6'>
		<dt className='text-sm font-medium text-gray-500 text-center mb-2'>
			{t('profile.image')}
		</dt>
		<dd className='flex justify-center'>
			<DefaultProfile
				size={96}
				photoURL={user.photoURL ? user.photoURL : null}
			/>
		</dd>
	</div>
);

export default ProfileImage;
