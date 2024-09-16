import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../public/locales/en/translation.json';
import koTranslation from '../public/locales/ko/translation.json';

i18n.use(initReactI18next) // react-i18next와 통합
	.init({
		resources: {
			en: {
				translation: enTranslation,
			},
			ko: {
				translation: koTranslation,
			},
		},
		lng: 'ko', // 기본 언어 설정
		fallbackLng: 'en', // 기본 언어가 없을 때 사용할 언어
		interpolation: {
			escapeValue: false, // XSS 보호용. React는 이미 보호를 제공하므로 false로 설정
		},
	});

export default i18n;
