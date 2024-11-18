import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Header from '@/components/home/header/Header';
import { motion } from 'framer-motion';
import AnimatedHeroBackground from '@/components/home/AnimatedHeroBackground';
import MainLayout from '@/components/common/layout/MainLayout';

const Home = () => {
	const { t } = useTranslation();

	// const features = [
	// 	{
	// 		title: t('home.features.profileSetup.title'),
	// 		description: t('home.features.profileSetup.description'),
	// 		icon: '👥',
	// 	},
	// 	{
	// 		title: t('home.features.realTimeChat.title'),
	// 		description: t('home.features.realTimeChat.description'),
	// 		icon: '💬',
	// 		href: '/chat',
	// 	},
	// 	{
	// 		title: t('home.features.timeline.title'),
	// 		description: t('home.features.timeline.description'),
	// 		icon: '📅',
	// 	},
	// 	{
	// 		title: t('home.features.todoList.title'),
	// 		description: t('home.features.todoList.description'),
	// 		icon: '✅',
	// 		href: '/',
	// 	},
	// ];

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
		<div className='min-h-screen'>
			<MainLayout>
				<Head>
					<title>{t('home.hero.title')}</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<Header />

				<main>
					{/* Hero Section */}
					<section className='bg-gradient-to-b from-white to-pink-100 relative min-h-screen flex items-center justify-center px-4'>
						<AnimatedHeroBackground />
					</section>

					{/* Features Section */}
					{/* <section className='py-16 sm:py-24'>
						<div className='container mx-auto px-4'>
							<h2 className='text-3xl sm:text-4xl font-heading font-bold text-center mb-12'>
								{t('home.features.title')}
							</h2>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
								{features.map((feature, index) => (
									<motion.div
										key={feature.title}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											delay: index * 0.1,
										}}
										className='bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300'>
										<div className='text-4xl mb-4'>{feature.icon}</div>
										<h3 className='text-xl font-heading font-semibold mb-2'>
											{feature.title}
										</h3>
										<p className='text-gray-600'>{feature.description}</p>
									</motion.div>
								))}
							</div>
						</div>
					</section> */}

					{/* Memorable Moments Section */}
					<section className='py-16 sm:py-24 bg-gradient-to-b from-white to-pink-50'>
						<div className='container mx-auto px-4'>
							<h2 className='text-3xl sm:text-4xl font-heading font-bold text-center mb-12'>
								추억을 만들어요
							</h2>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
								{memorableMoments.map((item, index) => (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											duration: 0.5,
											delay: index * 0.1,
										}}
										className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2'>
										<Link href={item.href}>
											<div className='h-60 relative overflow-hidden'>
												<Image
													alt='memory'
													src={item.image}
													fill
													className='object-cover transition duration-300 transform hover:scale-110'
												/>
											</div>
											<div className='p-6 bg-white z-10'>
												<h3 className='text-xl font-heading font-semibold mb-3'>
													{item.title}
												</h3>
												<p className='text-gray-600 text-sm'>
													{item.description}
												</p>
											</div>
										</Link>
									</motion.div>
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
								<Link
									href='/signup'
									className='bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold 
                  hover:bg-primary hover:text-white transition duration-300 shadow-lg hover:shadow-xl'>
									{t('common.getStarted')}
								</Link>
							</motion.div>
						</div>
					</section>
				</main>

				<footer className='bg-gray-800 text-white py-12 rounded-none'>
					<div className='container mx-auto px-4'>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
							<div>
								<h3 className='text-xl font-heading font-semibold mb-4'>
									{t('common.appName')}
								</h3>
								<p className='text-sm text-gray-400'>
									{t('home.hero.subtitle')}
								</p>
							</div>
						</div>
						<div className='mt-12 text-center text-sm text-gray-400'>
							<p>&copy; 2024 ing. All rights reserved</p>
						</div>
					</div>
				</footer>
			</MainLayout>
		</div>
	);
};

export default Home;
