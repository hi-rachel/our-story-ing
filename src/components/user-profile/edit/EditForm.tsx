import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { EditFormProps } from '../profileTypes';
import DefaultProfile from '../../common/profile/DefaultProfile';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	FaCalendarAlt,
	FaCamera,
	FaInfoCircle,
	FaTimes,
	FaUser,
	FaEnvelope,
	FaHeart,
	FaTrash,
	FaHeartBroken,
} from 'react-icons/fa';

const EditForm: React.FC<EditFormProps> = ({
	partnerName,
	editedUser,
	handleInputChange,
	handleSubmit,
	handleImageUpload,
	setIsEditing,
	handleImageDelete,
	t,
	handleAnniversaryChange,
	handleCoupleUnlink,
	handleDeleteAccount,
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			onSubmit={handleSubmit}>
			{/* Editable Profile Image */}
			<div className='flex justify-center items-center py-6'>
				<div className='relative'>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleImageClick}
						className='cursor-pointer relative rounded-full overflow-hidden'>
						<DefaultProfile size={96} photoURL={editedUser.photoURL || null} />
						<div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200'>
							<FaCamera className='text-white text-3xl' />
						</div>
					</motion.div>
					<input
						type='file'
						ref={fileInputRef}
						style={{ display: 'none' }}
						onChange={handleImageUpload}
						accept='image/*'
					/>
					{editedUser.photoURL && (
						<motion.button
							// whileTap={{ scale: 0.9 }}
							type='button'
							onClick={handleImageDelete}
							className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-error text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-red-600 focus:outline-none'
							aria-label={t('profile.deleteImage')}>
							<FaTimes />
						</motion.button>
					)}
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-4'>
				{/* Personal Information Section */}
				<div>
					<h3 className='text-lg font-medium text-gray-900 mb-4'>
						{t('profile.personalInfo')}
					</h3>
					<div className='space-y-4'>
						{/* Editable Display Name */}
						<div className='relative'>
							<label
								htmlFor='displayName'
								className='block text-sm font-medium text-gray-700 mb-1'>
								{t('profile.name')}
							</label>
							<div className='relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaUser className='text-gray-400' />
								</div>
								<input
									type='text'
									name='displayName'
									value={editedUser.displayName}
									onChange={handleInputChange}
									className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
							</div>
						</div>

						{/* Non-editable Email */}
						<div className='relative'>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-1'>
								{t('profile.email')}
							</label>
							<div className='relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaEnvelope className='text-gray-400' />
								</div>
								<input
									type='email'
									name='email'
									value={editedUser.email}
									disabled
									className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 text-gray-500 sm:text-sm'
								/>
							</div>
						</div>

						{/* Editable Bio / Status Message */}
						<div className='relative'>
							<label
								htmlFor='profileMessage'
								className='block text-sm font-medium text-gray-700 mb-1'>
								{t('profile.bio')}
							</label>
							<div className='relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none'>
									<FaInfoCircle className='text-gray-400' />
								</div>
								<textarea
									name='profileMessage'
									value={editedUser.profileMessage}
									onChange={handleInputChange}
									rows={3}
									className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Couple Information Section */}
				<div>
					<h3 className='text-lg font-medium text-gray-900 mb-4'>
						{t('profile.coupleInfo')}
					</h3>
					<div className='space-y-4'>
						{/* Partner Name (Read-only) */}
						<div className='relative'>
							<label
								htmlFor='partnerName'
								className='block text-sm font-medium text-gray-700 mb-1'>
								{t('profile.partner')}
							</label>
							<div className='relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaHeart className='text-gray-400' />
								</div>
								<input
									type='text'
									name='partnerName'
									value={partnerName || t('profile.single')}
									disabled
									className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 text-gray-500 sm:text-sm'
								/>
							</div>
						</div>

						{/* Editable Anniversary */}
						{partnerName && (
							<div className='relative'>
								<label
									htmlFor='anniversary'
									className='block text-sm font-medium text-gray-700 mb-1'>
									{t('profile.anniversary')}
								</label>
								<div className='relative rounded-md shadow-sm'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<FaCalendarAlt className='text-gray-400' />
									</div>
									<DatePicker
										selected={
											editedUser.anniversary
												? new Date(editedUser.anniversary)
												: null
										}
										onChange={handleAnniversaryChange}
										dateFormat='yyyy-MM-dd'
										className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
										wrapperClassName='w-full'
										popperClassName='react-datepicker-right'
										popperPlacement='bottom-start'
										placeholderText={t('profile.selectAnniversary')}
										showYearDropdown
										scrollableYearDropdown
										yearDropdownItemNumber={15}
									/>
								</div>
							</div>
						)}

						{/* Unlink Couple Button */}
						{partnerName && (
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type='button'
								onClick={handleCoupleUnlink}
								className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-error hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
								<FaHeartBroken className='inline-block mr-2' />
								{t('profile.unlinkCouple')}
							</motion.button>
						)}
					</div>
				</div>
			</div>

			{/* Save, Cancel, and Delete Account Buttons */}
			<div className='p-4 flex flex-col sm:flex-row justify-between items-center md:mt-8 mt-4 border-t gap-4'>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					type='button'
					onClick={handleDeleteAccount}
					className='w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-error hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
					<FaTrash className='inline-block mr-2' />
					{t('profile.deleteAccount')}
				</motion.button>
				<div className='flex space-x-3'>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='button'
						onClick={() => setIsEditing(false)}
						className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
						{t('common.cancel')}
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						className='px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-400 to-purple-300'>
						{t('common.save')}
					</motion.button>
				</div>
			</div>
		</motion.form>
	);
};

export default EditForm;
