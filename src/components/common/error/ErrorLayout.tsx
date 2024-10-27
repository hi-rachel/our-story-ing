import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAnimatingHeart } from '@/hooks/useAnimationHeart';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
	const { t } = useTranslation();
	const { isAnimating, heartVariants } = useAnimatingHeart();

	return (
		<div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-pink-50 to-purple-50'>
			{/* Decorative Elements */}
			<div className='absolute inset-0 z-0'>
				<div className='absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse'></div>
				<div className='absolute top-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000'></div>
				<div className='absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000'></div>
			</div>

			{/* Main Content */}
			<div className='relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen'>
				<div className='w-full max-w-lg mx-auto text-center space-y-8'>
					{/* Error Code */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-9xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent'>
						404
					</motion.div>

					{/* Icon */}
					<motion.div
						className='text-6xl'
						animate={isAnimating ? 'beat' : 'normal'}
						variants={heartVariants}>
						❤️‍🩹
					</motion.div>

					{/* Title & Message */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='space-y-4'>
						<h1 className='text-3xl font-heading font-bold text-gray-800'>
							{t('notFound.title')}
						</h1>
						<p className='text-lg text-gray-600 max-w-md mx-auto'>
							{t('notFound.message')}
						</p>
					</motion.div>

					{/* Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Link
							href='/'
							className='group px-8 py-3 bg-gradient-to-r from-accent to-primary 
                         text-white font-semibold rounded-full shadow-lg 
                         hover:shadow-xl transition-all duration-300
                         backdrop-blur-sm'>
							<motion.span
								className='block'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								{t('common.goBack')}
							</motion.span>
						</Link>
					</motion.div>

					{/* Extra Messages */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className='mt-12 space-y-2'>
						<p className='text-lg font-medium text-accent'>
							{t('notFound.dontWorry')}
						</p>
						<p className='text-gray-600'>{t('notFound.stayTogether')}</p>
					</motion.div>
				</div>
			</div>

			{/* Bottom Decoration */}
			<div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30'></div>
		</div>
	);
};

export default NotFoundPage;
