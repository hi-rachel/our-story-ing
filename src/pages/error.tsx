import { useRouter } from 'next/router';
import ErrorLayout from '@/components/common/error/ErrorLayout';

interface ErrorPageProps {
	errorMessage: string;
	t: (key: string) => string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage, t }) => {
	const router = useRouter();

	const handleGoBack = () => {
		if (window.history.length > 2) {
			router.back();
		} else {
			router.push('/');
		}
	};

	return (
		<ErrorLayout
			title={t('error.oops')}
			message={errorMessage}
			goBackText={t('common.goBack')}
			extraMessage={t('error.dontWorry')}
			extraSubMessage={t('error.stayTogether')}
			handleGoBack={handleGoBack}
		/>
	);
};

export default ErrorPage;
