import { useRef } from 'react';
import { EditFormProps } from './types';
import DefaultProfile from '../common/DefaultProfile';
import Image from 'next/image';

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
			fileInputRef.current.click(); // Trigger file input click
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4 px-4 py-5'>
			{/* Editable Profile Image */}
			<div className='flex justify-center items-center space-x-4'>
				<div className='relative' onClick={handleImageClick}>
					{editedUser.photoURL ? (
						<Image
							src={editedUser.photoURL}
							alt={t('profile.image')}
							className='rounded-full cursor-pointer border-2 border-primary'
							width={64}
							height={64}
						/>
					) : (
						<DefaultProfile size={64} />
					)}
					<input
						type='file'
						ref={fileInputRef}
						style={{ display: 'none' }}
						onChange={handleImageUpload} // Handle file upload
						accept='image/*'
					/>
				</div>

				{/* X button for deleting the image */}
				{editedUser.photoURL && (
					<button
						type='button'
						onClick={handleImageDelete} // Handle image deletion
						className='text-red-500 hover:text-red-700'
						aria-label={t('profile.deleteImage')}>
						X
					</button>
				)}
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
					className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary'
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
					className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary'
				/>
			</div>

			{/* Save and Cancel Buttons */}
			<div className='flex justify-end space-x-3'>
				<button
					type='button'
					onClick={() => setIsEditing(false)} // Cancel editing
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
