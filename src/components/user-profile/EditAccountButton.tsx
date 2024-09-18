import { EditAccountButtonProps } from './profileTypes';
import { motion } from 'framer-motion';

const EditAccountButton: React.FC<EditAccountButtonProps> = ({
	setIsEditing,
	t,
}) => (
	<motion.button
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
		onClick={() => setIsEditing(true)}
		className='flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
		{t('profile.edit')}
	</motion.button>
);

export default EditAccountButton;
