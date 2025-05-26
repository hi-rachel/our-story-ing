import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import MainHeader from '@/components/home/header/MainHeader';
import { motion } from 'framer-motion';
import AnimatedHeroBackground from '@/components/home/AnimatedHeroBackground';
import MainFooter from '@/components/common/footer/MainFooter';
import { useRouter } from 'next/router';

const Home = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const memorableMoments = [
		{
			id: 'photo-booth',
			image: '/images/photo-booth.png',
			title: t('home.moments.ingPhoto.title'),
			description: t('home.moments.ingPhoto.description'),
			href: '/ing-photo',
		},
		{
			id: 'photo-album',
			image: '/images/album.png',
			title: t('home.moments.anniversary.title'),
			description: t('home.moments.anniversary.description'),
			href: '/profile',
		},
		{
			id: 'contact',
			image: '/images/contact.png',
			title: t('home.moments.chatting.title'),
			description: t('home.moments.chatting.description'),
			href: '/profile',
		},
	];

	return (
		<div className='pb-16'>
			<main>
				<MainHeader />
				{/* Hero Section */}
				<section className='bg-gradient-to-b from-white to-pink-100 relative flex items-center justify-center px-4'>
					<AnimatedHeroBackground />
				</section>

				{/* Memorable Moments Section */}
				<section className='py-16 sm:py-24 bg-gradient-to-b from-white to-pink-50'>
					<div className='container mx-auto px-4'>
						<h2 className='text-3xl sm:text-4xl font-heading font-bold text-center mb-12'>
							추억을 만들어요
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
							{memorableMoments.map((item, index) => (
								<motion.article
									key={item.id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
									}}>
									<Link
										href={item.href}
										className='block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f472b6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff0f0] group min-h-[368px]'
										aria-label={`${item.title} - ${item.description}`}>
										<div className='h-60 relative overflow-hidden'>
											<Image
												alt={item.id}
												src={item.image}
												fill
												className='object-contain transition duration-300 group-hover:scale-105'
											/>
										</div>
										<div className='p-6 bg-white'>
											<h3 className='text-xl font-heading font-semibold mb-3 group-hover:text-pink-400 transition-colors'>
												{item.title}
											</h3>
											<p className='text-gray-600 text-sm'>
												{item.description}
											</p>
										</div>
									</Link>
								</motion.article>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='py-16 sm:py-24 bg-gradient-to-r from-pink-400 to-purple-300 text-white text-center'>
					<div className='container mx-auto px-4'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}>
							<h2 className='text-3xl sm:text-4xl font-heading font-bold mb-4'>
								{t('home.cta.title')}
							</h2>
							<p className='mb-8 text-lg max-w-2xl mx-auto'>
								{t('home.cta.subtitle')}
							</p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => router.push('/signup')}
								style={{ borderRadius: '9999px' }}
								className='mt-8 px-8 py-3 bg-white text-primary rounded-full
								font-semibold text-lg shadow-lg hover:shadow-xl transition
								duration-300'>
								{t('common.getStarted')}
							</motion.button>
						</motion.div>
					</div>
				</section>
				<MainFooter />
			</main>

			<footer className='bg-gray-800 text-white py-12 rounded-none'>
				<div className='container mx-auto px-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
						<div>
							<h3 className='text-xl font-heading font-semibold mb-4'>
								{t('common.appName')}
							</h3>
							<p className='text-sm text-gray-400'>{t('home.hero.subtitle')}</p>
						</div>
					</div>
					<div className='mt-12 text-center text-sm text-gray-400'>
						<p>&copy; 2024 ing. All rights reserved</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
