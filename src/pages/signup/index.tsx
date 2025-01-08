import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import GoogleLogin from '@/components/auth/google/GoogleLogin';
import { useRouter } from 'next/router';
import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';
import { handleAuthError } from '@/utils/firebaseError';

const SignUpPage = () => {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({
		name: '',
		password: '',
		confirmPassword: '',
	});

	// 이름 유효성 검사
	const validateName = (name: string) => {
		if (name.trim().length < 2) {
			return '이름은 2자 이상이어야 합니다';
		}
		if (name.trim().length > 30) {
			return '이름은 30자 이하여야 합니다';
		}
		// 한글, 영문, 공백만 허용
		if (!/^[가-힣a-zA-Z\s]+$/.test(name)) {
			return '이름은 한글, 영문, 공백만 입력 가능합니다';
		}
		return '';
	};

	// 비밀번호 유효성 검사
	const validatePassword = (password: string) => {
		if (password.length < 8) {
			return '비밀번호는 8자 이상이어야 합니다';
		}
		if (password.length > 50) {
			return '비밀번호는 50자 이하여야 합니다';
		}
		// 최소 8자, 영문 대소문자, 숫자, 특수문자 포함
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
			return '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다';
		}
		return '';
	};

	// 비밀번호 확인 검사
	const validateConfirmPassword = (
		password: string,
		confirmPassword: string
	) => {
		if (password !== confirmPassword) {
			return '비밀번호가 일치하지 않습니다';
		}
		return '';
	};

	// 입력값 변경 시 유효성 검사
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setName(newName);
		setErrors((prev) => ({
			...prev,
			name: validateName(newName),
		}));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
		setErrors((prev) => ({
			...prev,
			password: validatePassword(newPassword),
			confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
		}));
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const newConfirmPassword = e.target.value;
		setConfirmPassword(newConfirmPassword);
		setErrors((prev) => ({
			...prev,
			confirmPassword: validateConfirmPassword(password, newConfirmPassword),
		}));
	};

	useEffect(() => {
		const user = auth.currentUser;
		if (user) {
			router.push('/');
			toast.success('이미 로그인되어 있습니다');
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 최종 유효성 검사
		const nameError = validateName(name);
		const passwordError = validatePassword(password);
		const confirmPasswordError = validateConfirmPassword(
			password,
			confirmPassword
		);

		if (nameError || passwordError || confirmPasswordError) {
			setErrors({
				name: nameError,
				password: passwordError,
				confirmPassword: confirmPasswordError,
			});
			return;
		}

		setIsLoading(true);

		try {
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;

			// Update profile with display name
			await updateProfile(user, {
				displayName: name.trim(),
			});

			// Create user document in Firestore
			const userDocRef = doc(db, 'users', user.uid);
			await setDoc(userDocRef, {
				userId: user.uid,
				email: user.email,
				displayName: name.trim(),
				photoURL: null,
				profileMessage: '',
				isCouple: false,
				partnerId: '',
				createdAt: new Date(),
			});

			toast.success('회원가입이 완료되었습니다');
			router.push('/');
		} catch (error) {
			if (error instanceof Error) {
				console.error('회원가입 에러:', error);
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
				<title>회원가입</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white p-8 rounded-lg shadow-card w-full max-w-md'>
				<h2 className='text-3xl font-heading font-bold text-center text-primary mb-6'>
					회원가입
				</h2>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='name' className='block text-text mb-2 font-medium'>
							이름
						</label>
						<input
							type='text'
							id='name'
							value={name}
							onChange={handleNameChange}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.name ? 'border-red-500' : 'border-gray-300'
							}`}
							required
							disabled={isLoading}
						/>
						{errors.name && (
							<p className='mt-1 text-sm text-red-500'>{errors.name}</p>
						)}
					</div>
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
							required
							disabled={isLoading}
						/>
					</div>
					<div>
						<label
							htmlFor='password'
							className='block text-text mb-2 font-medium'>
							비밀번호
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={handlePasswordChange}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.password ? 'border-red-500' : 'border-gray-300'
							}`}
							required
							disabled={isLoading}
						/>
						{errors.password && (
							<p className='mt-1 text-sm text-red-500'>{errors.password}</p>
						)}
					</div>
					<div>
						<label
							htmlFor='confirmPassword'
							className='block text-text mb-2 font-medium'>
							비밀번호 확인
						</label>
						<input
							type='password'
							id='confirmPassword'
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
								errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
							}`}
							required
							disabled={isLoading}
						/>
						{errors.confirmPassword && (
							<p className='mt-1 text-sm text-red-500'>
								{errors.confirmPassword}
							</p>
						)}
					</div>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={
							isLoading ||
							!!errors.name ||
							!!errors.password ||
							!!errors.confirmPassword
						}
						className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300 shadow-button disabled:opacity-50 disabled:cursor-not-allowed'>
						{isLoading ? '회원가입 중...' : '회원가입'}
					</motion.button>
				</form>

				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300'></div>
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-white text-text'>
								또는 다음으로 회원가입
							</span>
						</div>
					</div>
					<div className='mt-6 flex justify-center align-middle'>
						<GoogleLogin disabled={isLoading} />
					</div>
				</div>

				<p className='mt-8 text-center text-sm text-text'>
					이미 계정이 있으신가요?{' '}
					<Link
						href='/login'
						className='font-medium text-primary hover:text-secondary transition duration-300'>
						로그인
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
