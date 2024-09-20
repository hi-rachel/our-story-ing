import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';
import Loading from '@/components/common/Loading';
import Meta from '@/components/common/Meta';

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

	// Show a loading screen or spinner while authentication state is being checked
	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<Meta />
			<Component {...pageProps} />
		</>
	);
};

export default appWithTranslation(App);
