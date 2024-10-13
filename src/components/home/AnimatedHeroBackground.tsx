import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AnimatedHeroBackground = () => {
	return (
		<div className='text-black relative w-full h-screen overflow-hidden'>
			<div className='mt-16 leading-snug relative z-10 flex flex-col items-center justify-center h-full'>
				<motion.h1
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
					className='text-6xl font-bold mb-4 text-center'>
					<span className='inline-block animate-float text-primary'>
						우리의
					</span>{' '}
					<span className='inline-block animate-float animation-delay-300 text-primary'>
						이야기는
					</span>{' '}
					<span className='inline-block animate-float animation-delay-600 pt-4 text-primary'>
						현재
					</span>{' '}
					<span className='inline-block animate-float animation-delay-900 pt-4 text-primary'>
						진행중
					</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.5 }}
					className='text-2xl text-center max-w-2xl pt-3'>
					우리의 소중한 순간을 기록하고 공유하세요
				</motion.p>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className='text-primary mt-8 px-8 py-3 bg-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300'>
					시작하기
				</motion.button>
				<Image
					className='mt-6'
					width={300}
					height={400}
					src='/images/main-couple.png'
					alt='home couple image'
				/>
			</div>

			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}
				.animate-float {
					animation: float 3s ease-in-out infinite;
				}
				.animation-delay-300 {
					animation-delay: 300ms;
				}
				.animation-delay-600 {
					animation-delay: 600ms;
				}
			`}</style>
		</div>
	);
};

export default AnimatedHeroBackground;
