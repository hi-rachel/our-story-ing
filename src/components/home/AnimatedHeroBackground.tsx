import { motion } from 'framer-motion';
import Image from 'next/image';

const AnimatedHeroBackground = () => {
	return (
		<div className='relative w-full min-h-screen overflow-hidden pt-32 sm:pt-48 text-primary'>
			<div className='flex flex-col items-center justify-center h-full px-4 text-center'>
				<motion.h1
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
					className='text-4xl sm:text-5xl md:text-6xl font-bold leading-relaxed mb-3'>
					<span className='inline-block'>우리의</span>{' '}
					<span className='inline-block animation-delay-300'>이야기는</span>{' '}
					<br className='block sm:hidden' />
					<span className='inline-block animation-delay-600'>현재</span>{' '}
					<span className='inline-block animation-delay-900'>진행중</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.5 }}
					className='text-lg sm:text-xl md:text-2xl max-w-2xl text-gray-700'>
					우리만의 소중한 순간을 기록하고 공유하세요 💗
				</motion.p>
				<Image
					className='mt-8'
					width={300}
					height={400}
					src='/images/main-image.png'
					alt='home couple image'
					priority
				/>
			</div>
		</div>
	);
};

export default AnimatedHeroBackground;
