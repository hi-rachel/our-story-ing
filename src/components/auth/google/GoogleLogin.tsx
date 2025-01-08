import { FC } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../../../firebase';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface GoogleLoginProps {
	disabled?: boolean;
}

const GoogleLogin: FC<GoogleLoginProps> = ({ disabled = false }) => {
	const { t } = useTranslation();
	const router = useRouter();

	const handleGoogleLogin = async () => {
		if (disabled) return;

		try {
			const GoogleProvider = new GoogleAuthProvider();
			GoogleProvider.setCustomParameters({
				prompt: 'select_account',
			});
			const result = await signInWithPopup(auth, GoogleProvider);
			const user = result.user;

			const userDocRef = doc(db, 'users', user.uid);
			const userDocSnap = await getDoc(userDocRef);

			if (!userDocSnap.exists()) {
				// If user document doesn't exist, create a new one
				await setDoc(userDocRef, {
					userId: user.uid,
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
					profileMessage: '', // Initialize empty profile message
					isCouple: false, // Initial couple status
					partnerId: '', // No partner by default
					createdAt: new Date(),
				});
			}
			toast.success(t('login.loginSuccess'));
			router.push('/');
		} catch (error) {
			console.error('Error logging in with Google: ', error);
		}
	};

	return (
		<button
			onClick={handleGoogleLogin}
			disabled={disabled}
			className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed'>
			<img
				src='/login/google-logo.png'
				alt='Google logo'
				className='w-5 h-5 mr-2'
			/>
			{t('login.GoogleSignUp')}
		</button>
	);
};

export default GoogleLogin;
