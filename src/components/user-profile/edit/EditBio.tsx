import { EditFieldProps } from '../profileTypes';

const EditBio: React.FC<EditFieldProps> = ({
	editedUser,
	handleInputChange,
	t,
}) => (
	<div>
		<label
			htmlFor='profileMessage'
			className='block text-sm font-medium text-gray-700'>
			{t('profile.bio')}
		</label>
		<textarea
			name='profileMessage'
			id='profileMessage'
			rows={3}
			value={editedUser.profileMessage}
			onChange={handleInputChange}
			className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary'
		/>
	</div>
);

export default EditBio;
