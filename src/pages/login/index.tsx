import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import GoogleLogin from '@/components/auth/google/GoogleLogin';
import { auth } from '../../../firebase';
import { useRouter } from 'next/router';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		const user = auth.currentUser;
		// 이미 로그인된 유저는 로그인 페이지 접근 제한
		// 알림 띄우기
		if (user) {
			router.push('/');
		}
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle login logic here
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-white flex items-center justify-center px-4'>
			<Head>
				<title>{t('login.title')}</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white p-8 rounded-lg shadow-card w-full max-w-md'>
				<h2 className='text-3xl font-heading font-bold text-center text-primary mb-6'>
					{t('login.title')}
				</h2>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							{t('login.email')}
						</label>
						<div className='mt-1'>
							<input
								type='email'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'>
							{t('login.password')}
						</label>
						<div className='mt-1'>
							<input
								type='password'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								required
							/>
						</div>
					</div>

					<div className='flex items-center justify-end'>
						<div className='text-sm'>
							<Link
								href='/forgot-password'
								className='font-medium text-primary hover:text-secondary'>
								{t('login.forgotPassword')}
							</Link>
						</div>
					</div>

					<div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
							{t('login.logIn')}
						</motion.button>
					</div>
				</form>

				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-white text-gray-500'>
								{t('login.orLoginWith')}
							</span>
						</div>
					</div>
					<div className='mt-6 flex justify-center align-middle'>
						<GoogleLogin />
					</div>
				</div>

				<p className='mt-8 text-center text-sm text-gray-600'>
					{t('login.dontHaveAccount')}{' '}
					<Link
						href='/signup'
						className='font-medium text-primary hover:text-secondary'>
						{t('login.signUp')}
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default LoginPage;
