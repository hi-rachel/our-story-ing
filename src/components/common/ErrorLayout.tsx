import { motion } from 'framer-motion';
import { useAnimatingHeart } from '@/hooks/useAnimationHeart';

interface ErrorLayoutProps {
	title: string;
	message: string;
	goBackText: string;
	extraMessage?: string;
	extraSubMessage?: string;
	handleGoBack: () => void;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({
	title,
	message,
	goBackText,
	extraMessage,
	extraSubMessage,
	handleGoBack,
}) => {
	const { isAnimating, heartVariants } = useAnimatingHeart();

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4'>
			<motion.div
				className='text-6xl mb-8'
				animate={isAnimating ? 'beat' : 'normal'}
				variants={heartVariants}>
				💔
			</motion.div>
			<h1 className='text-3xl font-heading font-semibold text-primary mb-4 text-center'>
				{title}
			</h1>
			<p className='text-xl text-text mb-8 text-center max-w-md'>
				{message}
			</p>
			<motion.button
				onClick={handleGoBack}
				className='bg-accent hover:bg-primary text-white font-bold py-3 px-6 rounded-large shadow-button transition-colors duration-300'
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}>
				{goBackText}
			</motion.button>
			{extraMessage && (
				<motion.div
					className='mt-12 text-accent text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}>
					<p className='text-lg mb-2'>{extraMessage}</p>
					{extraSubMessage && (
						<p className='text-md'>{extraSubMessage}</p>
					)}
				</motion.div>
			)}
		</div>
	);
};

export default ErrorLayout;
