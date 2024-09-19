import Image from 'next/image';
import { FaUserAstronaut } from 'react-icons/fa';

interface DefaultProfileProps {
	photoURL?: string | null;
	size: number;
}

const DefaultProfile: React.FC<DefaultProfileProps> = ({ photoURL, size }) => {
	return (
		<div
			className='rounded-full border-2 border-primary flex items-center justify-center overflow-hidden'
			style={{ width: `${size}px`, height: `${size}px` }}>
			{photoURL ? (
				<Image
					className='object-cover'
					src={photoURL}
					alt='User Profile'
					width={size}
					height={size}
				/>
			) : (
				<FaUserAstronaut size={size * 0.5} />
			)}
		</div>
	);
};

export default DefaultProfile;
