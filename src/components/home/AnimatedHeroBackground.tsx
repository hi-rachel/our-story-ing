import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AnimatedHeroBackground = () => {
	return (
		<div className='relative w-full min-h-screen overflow-hidden pt-32 sm:pt-32 md:pt-40 text-black'>
			<div className='flex flex-col items-center justify-center h-full px-4 text-center'>
				<motion.h1
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
					className='text-4xl sm:text-5xl md:text-6xl font-bold leading-relaxed mb-6'>
					<span className='inline-block text-primary'>우리의</span>{' '}
					<span className='inline-block animation-delay-300 text-primary'>
						이야기는
					</span>{' '}
					<br className='block sm:hidden' />
					<span className='inline-block animation-delay-600 text-primary'>
						현재
					</span>{' '}
					<span className='inline-block animation-delay-900 text-primary'>
						진행중
					</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.5 }}
					className='text-lg sm:text-xl md:text-2xl max-w-2xl pt-3'>
					우리만의 소중한 순간을 기록하고 공유하세요 💗
				</motion.p>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className='mt-8 px-8 py-3 bg-white text-primary rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300'>
					시작하기
				</motion.button>
				<Image
					className='mt-6'
					width={300}
					height={400}
					src='/images/main-couple.png'
					alt='home couple image'
					priority
				/>
			</div>
		</div>
	);
};

export default AnimatedHeroBackground;
