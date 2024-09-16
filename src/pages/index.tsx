import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';

const Home = () => {
	const { t } = useTranslation();

	const features = [
		{
			title: t('home.features.profileSetup.title'),
			description: t('home.features.profileSetup.description'),
			icon: '👥',
			href: '/profile',
		},
		{
			title: t('home.features.realTimeChat.title'),
			description: t('home.features.realTimeChat.description'),
			icon: '💬',
			href: '/chatting',
		},
		{
			title: t('home.features.timeline.title'),
			description: t('home.features.timeline.description'),
			icon: '📅',
			href: '/',
		},
		{
			title: t('home.features.todoList.title'),
			description: t('home.features.todoList.description'),
			icon: '✅',
			href: '/',
		},
	];

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-white font-sans'>
			<Head>
				<title>{t('home.hero.title')}</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Header />

			<main>
				{/* Hero Section */}
				<section className='relative min-h-screen flex items-center justify-center px-4'>
					<div className='absolute inset-0'>
						<Image
							alt='main image'
							src='/main.jpg'
							layout='fill'
							objectFit='cover'
						/>
					</div>
					<div className='relative z-10 text-center'>
						<h1 className='text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-6 shadow-text'>
							{t('home.hero.title')}
						</h1>
						<p className='text-xl sm:text-2xl text-white mb-8 shadow-text'>
							{t('home.hero.subtitle')}
						</p>
						<Link
							href='/signup'
							className='bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary hover:text-white transition duration-300 shadow-button'>
							{t('common.getStarted')}
						</Link>
					</div>
				</section>

				{/* Features Section */}
				<section id='features' className='py-16 sm:py-24 bg-white'>
					<div className='container mx-auto px-4'>
						<h2 className='text-3xl sm:text-4xl font-heading font-bold text-center mb-12 text-primary'>
							{t('home.features.title')}
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12'>
							{features.map((feature, index) => (
								<div
									key={index}
									className='bg-background rounded-lg p-6 text-center hover:shadow-lg transition duration-300 transform hover:-translate-y-1'>
									<Link href={feature.href}>
										<div className='text-4xl sm:text-5xl mb-4'>
											{feature.icon}
										</div>
										<h3 className='text-xl font-heading font-semibold mb-3'>
											{feature.title}
										</h3>
										<p className='text-text text-sm'>
											{feature.description}
										</p>
									</Link>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Timeline Preview Section */}
				<section className='py-16 sm:py-24 bg-gradient-to-b from-white to-secondary/20'>
					<div className='container mx-auto px-4'>
						<h2 className='text-3xl sm:text-4xl font-heading font-bold text-center mb-12 text-primary'>
							{t('home.timelinePreview.title')}
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
							{[1, 2, 3].map((item) => (
								<div
									key={item}
									className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1'>
									<div className='h-48 bg-primary/20'></div>
									<div className='p-6'>
										<h3 className='text-xl font-heading font-semibold mb-3 text-primary'>
											{t('home.timelinePreview.moment')}{' '}
											{item}
										</h3>
										<p className='text-text text-sm'>
											{t(
												'home.timelinePreview.description'
											)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='py-16 sm:py-24 bg-primary text-white text-center'>
					<div className='container mx-auto px-4'>
						<h2 className='text-3xl sm:text-4xl font-heading font-bold mb-4'>
							{t('home.cta.title')}
						</h2>
						<p className='mb-8 text-lg max-w-2xl mx-auto'>
							{t('home.cta.subtitle')}
						</p>
						<Link
							href='/signup'
							className='bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-secondary hover:text-white transition duration-300 shadow-button'>
							{t('common.getStarted')}
						</Link>
					</div>
				</section>
			</main>

			<footer className='bg-text text-white py-12'>
				<div className='container mx-auto px-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
						<div>
							<h3 className='text-xl font-heading font-semibold mb-4'>
								{t('common.appName')}
							</h3>
							<p className='text-sm'>{t('home.hero.subtitle')}</p>
						</div>
						<div>
							<h3 className='text-xl font-heading font-semibold mb-4'>
								{t('footer.quickLinks')}
							</h3>
							<ul className='space-y-2 text-sm'>
								<li>
									<Link
										href='/terms'
										className='hover:text-secondary transition duration-300'>
										{t('footer.termsOfService')}
									</Link>
								</li>
								<li>
									<Link
										href='/privacy'
										className='hover:text-secondary transition duration-300'>
										{t('footer.privacyPolicy')}
									</Link>
								</li>
								<li>
									<Link
										href='/contact'
										className='hover:text-secondary transition duration-300'>
										{t('footer.contactUs')}
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className='text-xl font-heading font-semibold mb-4'>
								{t('footer.followUs')}
							</h3>
							<div className='flex space-x-4'>
								<a
									href='#'
									className='text-2xl hover:text-secondary transition duration-300'>
									📘
								</a>
								<a
									href='#'
									className='text-2xl hover:text-secondary transition duration-300'>
									📷
								</a>
							</div>
						</div>
					</div>
					<div className='mt-12 text-center text-sm'>
						<p>&copy; 2024 ing. All rights reserved</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
