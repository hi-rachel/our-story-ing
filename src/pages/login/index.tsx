import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GoogleLogin from '@/components/auth/google/GoogleLogin';
import { auth } from '../../../firebase';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { handleAuthError } from '@/utils/firebaseError';
import { FirebaseError } from 'firebase/app';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const user = auth.currentUser;
		if (user) {
			router.push('/');
			toast.success('이미 로그인되어 있습니다.');
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				toast.success('로그인에 성공했습니다.');
				router.push('/');
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error('로그인 에러:', error);
				const firebaseError = error as FirebaseError;
				const errorMessage = handleAuthError(firebaseError);
				toast.error(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gradient-to-t from-background to-white px-4'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h2 className='text-3xl font-heading font-bold text-center text-primary mb-6'>
					지금 함께하기
				</h2>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							이메일
						</label>
						<div className='mt-1'>
							<input
								type='email'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								required
								disabled={isLoading}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'>
							비밀번호
						</label>
						<div className='mt-1'>
							<input
								type='password'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								required
								disabled={isLoading}
							/>
						</div>
					</div>

					<div className='flex items-center justify-end'>
						<div className='text-sm'>
							<Link
								href='/reset-password'
								className='font-medium text-primary hover:text-primary-dark'>
								비밀번호를 잊으셨나요?
							</Link>
						</div>
					</div>

					<div>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='submit'
							disabled={isLoading}
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed'>
							{isLoading ? '로그인 중...' : '로그인'}
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
								또는 다음으로 로그인
							</span>
						</div>
					</div>
					<div className='mt-6 flex justify-center align-middle'>
						<GoogleLogin disabled={isLoading} />
					</div>
				</div>

				<p className='mt-8 text-center text-sm text-gray-600'>
					계정이 없으신가요?{' '}
					<Link
						href='/signup'
						className='font-medium text-primary hover:text-dark'>
						회원가입
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default LoginPage;
