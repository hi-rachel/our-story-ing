import { EditAccountButtonProps } from '../profileTypes';
import { motion } from 'framer-motion';

const EditAccountButton: React.FC<EditAccountButtonProps> = ({
	setIsEditing,
	t,
}) => (
	<motion.button
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
		onClick={() => setIsEditing(true)}
		className='flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-400 to-purple-300'>
		{t('profile.edit')}
	</motion.button>
);

export default EditAccountButton;
