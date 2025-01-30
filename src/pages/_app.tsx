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
import PageHeader from '@/components/common/header/PageHeader';

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	const ownHeaderRoutes = ['/', '/chat'];
	const isCoupleChatPage = router.pathname.startsWith('/couple-chat');

	const publicRoutes = [
		'/',
		'/login',
		'/signup',
		'/reset-password',
		'/ing-photo',
	];

	const pageTitleMap: Record<string, string> = {
		'/': 'Our Story Ing',
		'/login': '로그인 | Our Story Ing',
		'/signup': '회원가입 | Our Story Ing',
		'/reset-password': '비밀번호 재설정 | Our Story Ing',
		'/profile': '프로필 | Our Story Ing',
		'/ing-photo': 'ing photo 📸',
		'/chat': '채팅 | Our Story Ing',
		'/couple-chat': '커플 채팅 | Our Story Ing',
	};

	const getPageTitle = () => {
		const path = router.pathname;

		// 동적 라우트(`/couple-chat/[id]`)에 대한 title 처리
		if (path.startsWith('/couple-chat')) {
			return `커플 채팅 | Our Story Ing`;
		}

		return pageTitleMap[path] || 'Our Story Ing';
	};

	const initAuthState = () => {
		auth.onAuthStateChanged((authUser) => {
			setUser(authUser ? authUser : null);
			setLoading(false);

			if (authUser) {
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
			router.push('/login');
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

	const showHeader =
		!ownHeaderRoutes.includes(router.pathname) && !isCoupleChatPage;

	return (
		<>
			<Meta title={getPageTitle()} />
			<div className='min-h-screen flex flex-col'>
				{showHeader && (
					<PageHeader title={pageTitleMap[router.pathname] || 'ing'} />
				)}
				<main className={`flex-1 ${showHeader ? 'pt-14' : ''}`}>
					<Component {...pageProps} />
				</main>
			</div>
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
