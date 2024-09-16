import React from 'react';
import { FaUserAstronaut } from 'react-icons/fa';

interface DefaultProfileProps {
	photoURL?: string;
	size: number;
}

const DefaultProfile: React.FC<DefaultProfileProps> = ({ photoURL, size }) => {
	return (
		<div
			className='rounded-full border-2 border-primary flex items-center justify-center'
			style={{ width: size, height: size }}>
			{photoURL ? (
				<img
					src={photoURL}
					alt='User Profile'
					className='rounded-full'
					style={{ width: size, height: size }}
				/>
			) : (
				<FaUserAstronaut size={size * 0.5} />
			)}
		</div>
	);
};

export default DefaultProfile;
