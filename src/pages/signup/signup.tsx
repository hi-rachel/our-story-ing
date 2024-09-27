import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import GoogleLogin from '@/components/auth/google/GoogleLogin';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';

const SignUpPage = () => {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		const user = auth.currentUser;
		// 이미 로그인된 유저는 회원가입 페이지 접근 제한
		// 알림 띄우기
		if (user) {
			router.push('/');
		}
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle signup logic here
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-white flex items-center justify-center px-4'>
			<Head>
				<title>{t('signup.title')}</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white p-8 rounded-lg shadow-card w-full max-w-md'>
				<h2 className='text-3xl font-heading font-bold text-center text-primary mb-6'>
					{t('signup.title')}
				</h2>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='name'
							className='block text-text mb-2 font-medium'>
							{t('signup.fullName')}
						</label>
						<input
							type='text'
							id='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
							required
						/>
					</div>
					<div>
						<label
							htmlFor='email'
							className='block text-text mb-2 font-medium'>
							{t('signup.email')}
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
							required
						/>
					</div>
					<div>
						<label
							htmlFor='password'
							className='block text-text mb-2 font-medium'>
							{t('signup.password')}
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
							required
						/>
					</div>
					<button
						type='submit'
						className='w-full bg-primary text-white py-2 rounded-md hover:bg-secondary hover:text-primary transition duration-300 shadow-button'>
						{t('signup.signUp')}
					</button>
				</form>
				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300'></div>
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-white text-text'>
								{t('signup.orSignUpWith')}
							</span>
						</div>
					</div>
					<div className='mt-6 flex justify-center align-middle'>
						<GoogleLogin />
					</div>
					{/* <div className="mt-6 grid grid-cols-2 gap-3">
            <GoogleLogin />
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-text hover:bg-gray-50 transition duration-300">
              KakaoTalk
            </button>
          </div> */}
				</div>
				<p className='mt-8 text-center text-sm text-text'>
					{t('signup.alreadyHaveAccount')}{' '}
					<Link
						href='/login'
						className='font-medium text-primary hover:text-secondary transition duration-300'>
						{t('signup.logIn')}
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
