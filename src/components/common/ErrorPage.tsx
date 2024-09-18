import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface ErrorPageProps {
	errorMessage: string;
	t: (key: string) => string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage, t }) => {
	const router = useRouter();
	const [isAnimating, setIsAnimating] = useState(false);

	const handleGoBack = () => {
		const isLocalhost = window.location.hostname === 'localhost';

		if (window.history.length > 2) {
			router.back();
		} else {
			if (isLocalhost) {
				router.push('/');
			} else {
				window.location.href =
					process.env.NEXT_PUBLIC_BASE_URL ||
					'https://our-story-ing.vercel.app';
			}
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating((prev) => !prev);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const heartVariants = {
		beat: {
			scale: [1, 1.1, 1],
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4'>
			<motion.div
				className='text-6xl mb-8'
				animate={isAnimating ? 'beat' : 'normal'}
				variants={heartVariants}>
				💔
			</motion.div>
			<h1 className='text-3xl font-heading font-semibold text-primary mb-4 text-center'>
				{t('error.oops')}
			</h1>
			<p className='text-xl text-text mb-8 text-center max-w-md'>
				{errorMessage}
			</p>
			<motion.button
				onClick={handleGoBack}
				className='bg-accent hover:bg-primary text-white font-bold py-3 px-6 rounded-large shadow-button transition-colors duration-300'
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}>
				{t('common.goBack')}
			</motion.button>
			<motion.div
				className='mt-12 text-accent text-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}>
				<p className='text-lg mb-2'>{t('error.dontWorry')}</p>
				<p className='text-md'>{t('error.stayTogether')}</p>
			</motion.div>
		</div>
	);
};

export default ErrorPage;
