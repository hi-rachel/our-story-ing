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
import '../styles/globals.css';
import { onMessage } from '@firebase/messaging';

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	const publicRoutes = ['/', '/login', '/signup']; // Publicly accessible routes

	const init = async () => {
		auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				setUser(null);
			}
			setLoading(false);
		});
	};

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		// Redirect logic: If not logged in and not on a public route, redirect to login
		if (!loading && !user && !publicRoutes.includes(router.pathname)) {
			router.push('/login');
		}
	}, [user, loading, router]);

	useEffect(() => {
		// FCM 권한 요청 및 토큰 저장
		requestPermissionAndSaveToken();

		// Foreground 푸시 알림 처리
		if (messaging) {
			const unsubscribe = onMessage(messaging, (payload) => {
				const { notification, data } = payload;
				if (notification && data) {
					// 기본 브라우저 알림
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

			return () => unsubscribe(); // Cleanup 함수
		}
	}, []);

	// Show a loading screen or spinner while authentication state is being checked
	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<Meta />
			<Component {...pageProps} />
			<ToastContainer
				position='top-right' // 원하는 위치 설정 가능 (예: top-right, bottom-left 등)
				autoClose={5000} // 자동으로 닫히는 시간 (ms)
				hideProgressBar={false} // 프로그레스바 숨기기 설정
				newestOnTop={false} // 새로운 Toast를 상단에 표시
				pauseOnHover // 마우스 Hover 시 일시 정지
				draggable // 드래그로 닫기
				theme='colored' // 테마 설정 (light, dark, colored 등)
			/>
		</>
	);
};

export default appWithTranslation(App);
