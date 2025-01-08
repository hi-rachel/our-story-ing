import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { handleAuthError } from '@/utils/firebaseError';
import { FirebaseError } from 'firebase/app';

const ResetPasswordPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.error('이메일을 입력해주세요');
			return;
		}

		setIsLoading(true);

		try {
			// Firebase 비밀번호 재설정 이메일 발송
			await sendPasswordResetEmail(auth, email, {
				// 비밀번호 재설정 후 리다이렉트될 URL (선택사항)
				url: `${window.location.origin}/login`,
			});

			toast.success(
				'비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인해주세요.'
			);
			router.push('/login');
		} catch (error) {
			if (error instanceof Error) {
				console.error('Password reset error:', error);
				const firebaseError = error as FirebaseError;
				const errorMessage = handleAuthError(firebaseError);
				toast.error(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-white flex items-center justify-center px-4'>
			<Head>
				<title>비밀번호 재설정</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white p-8 rounded-lg shadow-card w-full max-w-md'>
				<h2 className='text-3xl font-heading font-bold text-center text-primary mb-6'>
					비밀번호 재설정
				</h2>

				<p className='text-text text-center mb-6'>
					가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
				</p>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='email' className='block text-text mb-2 font-medium'>
							이메일
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
							placeholder='example@email.com'
							required
							disabled={isLoading}
						/>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading}
						className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300 shadow-button disabled:opacity-50 disabled:cursor-not-allowed'>
						{isLoading ? '전송 중...' : '재설정 링크 전송'}
					</motion.button>
				</form>

				<div className='mt-6 space-y-4'>
					<p className='text-center text-sm'>
						<Link
							href='/login'
							className='text-primary hover:text-secondary transition duration-300'>
							로그인으로 돌아가기
						</Link>
					</p>

					<p className='text-center text-sm text-text'>
						계정이 없으신가요?{' '}
						<Link
							href='/signup'
							className='font-medium text-primary hover:text-secondary transition duration-300'>
							회원가입
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default ResetPasswordPage;
