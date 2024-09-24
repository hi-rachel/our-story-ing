import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import ErrorLayout from '@/components/common/ErrorLayout';

const NotFoundPage: React.FC = () => {
	const router = useRouter();
	const { t } = useTranslation();

	const handleGoBack = () => {
		if (window.history.length > 2) {
			router.back();
		} else {
			router.push('/');
		}
	};

	return (
		<ErrorLayout
			title={t('notFound.title')}
			message={t('notFound.message')}
			goBackText={t('common.goBack')}
			extraMessage={t('notFound.dontWorry')}
			extraSubMessage={t('notFound.stayTogether')}
			handleGoBack={handleGoBack}
		/>
	);
};

export default NotFoundPage;
