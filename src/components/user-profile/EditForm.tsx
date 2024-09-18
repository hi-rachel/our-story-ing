import React, { useRef } from 'react';
import { EditFormProps } from './profileTypes';
import DefaultProfile from '../common/DefaultProfile';

const EditForm: React.FC<EditFormProps> = ({
	editedUser,
	handleInputChange,
	handleSubmit,
	handleImageUpload,
	setIsEditing,
	handleImageDelete,
	t,
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4 px-4 py-5'>
			{/* Editable Profile Image */}
			<div className='flex justify-center items-center'>
				<div
					onClick={handleImageClick}
					className='cursor-pointer relative'>
					<DefaultProfile
						size={96}
						photoURL={editedUser.photoURL || null}
					/>
					<input
						type='file'
						ref={fileInputRef}
						style={{ display: 'none' }}
						onChange={handleImageUpload}
						accept='image/*'
					/>
					{editedUser.photoURL && (
						<button
							type='button'
							onClick={handleImageDelete}
							className='absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-700 focus:outline-none'
							aria-label={t('profile.deleteImage')}>
							x
						</button>
					)}
				</div>
			</div>

			{/* Editable Display Name */}
			<div>
				<label
					htmlFor='displayName'
					className='block text-sm font-medium text-gray-700'>
					{t('profile.name')}
				</label>
				<input
					type='text'
					name='displayName'
					value={editedUser.displayName}
					onChange={handleInputChange}
					className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 '
				/>
			</div>

			{/* Editable Bio / Status Message */}
			<div>
				<label
					htmlFor='profileMessage'
					className='block text-sm font-medium text-gray-700'>
					{t('profile.bio')}
				</label>
				<textarea
					name='profileMessage'
					value={editedUser.profileMessage}
					onChange={handleInputChange}
					rows={3}
					className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3'
				/>
			</div>

			{/* Save and Cancel Buttons */}
			<div className='flex justify-end space-x-3'>
				<button
					type='button'
					onClick={() => setIsEditing(false)}
					className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
					{t('common.cancel')}
				</button>
				<button
					type='submit'
					className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
					{t('common.save')}
				</button>
			</div>
		</form>
	);
};

export default EditForm;
