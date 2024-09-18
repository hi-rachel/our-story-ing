import React from 'react';
import { DeleteAccountButtonProps } from './profileTypes';

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({
	handleDeleteAccount,
	t,
}) => {
	return (
		<button
			onClick={handleDeleteAccount}
			className='flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
			{t('profile.deleteAccount')}
		</button>
	);
};

export default DeleteAccountButton;
