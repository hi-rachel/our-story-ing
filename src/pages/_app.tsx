import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../i18n';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, messaging, requestPermissionAndSaveToken } from '../../firebase';
import { User } from 'firebase/auth';
import Loading from '@/components/common/loading/Loading';
import Meta from '@/components/common/meta/Meta';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onMessage } from '@firebase/messaging';

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	const publicRoutes = [
		'/',
		'/login',
		'/signup',
		'/reset-password',
		'/ing-photo',
	];

	const initAuthState = () => {
		auth.onAuthStateChanged((authUser) => {
			setUser(authUser ? authUser : null);
			setLoading(false);

			if (authUser) {
				// 로그인된 상태에서 /main으로 리디렉션
				if (router.pathname === '/login' || router.pathname === '/signup') {
					router.push('/');
				}
			}
		});
	};

	useEffect(() => {
		initAuthState();
	}, []);

	useEffect(() => {
		if (!loading && !user && !publicRoutes.includes(router.pathname)) {
			router.push('/login'); // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
		}
	}, [user, loading, router]);

	useEffect(() => {
		requestPermissionAndSaveToken();

		if (messaging) {
			const unsubscribe = onMessage(messaging, (payload) => {
				const { notification, data } = payload;
				if (notification && data) {
					new Notification(notification.title || '', {
						body: notification.body,
						icon: '/icons/couple.svg',
					});

					toast(`💬 ${notification.title}: ${notification.body}`, {
						onClick: () => {
							router.push(`/couple-chat/${data.coupleId}`);
						},
					});
				}
			});

			return () => unsubscribe();
		}
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<Meta />
			{user ? <Component {...pageProps} /> : <Component {...pageProps} />}
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				pauseOnHover
				draggable
				theme='colored'
			/>
		</>
	);
};

export default appWithTranslation(App);
