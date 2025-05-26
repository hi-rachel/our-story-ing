import { FirebaseError } from '@firebase/app';
import { AuthErrorCodes } from 'firebase/auth';

export const handleAuthError = (error: FirebaseError): string => {
	let errorMessage = '예상치 못한 오류가 발생했습니다';

	switch (error.code) {
		case AuthErrorCodes.EMAIL_EXISTS:
			errorMessage = '이미 사용 중인 이메일입니다';
			break;
		// 회원가입 관련 에러
		case 'auth/email-already-in-use':
			errorMessage = '이미 사용 중인 이메일입니다';
			break;
		case 'auth/invalid-email':
			errorMessage = '유효하지 않은 이메일 형식입니다';
			break;
		case 'auth/operation-not-allowed':
			errorMessage = '이메일/비밀번호 로그인이 비활성화되어 있습니다';
			break;
		case 'auth/weak-password':
			errorMessage = '비밀번호가 너무 약합니다';
			break;

		// 로그인 관련 에러
		case 'auth/user-disabled':
			errorMessage = '비활성화된 계정입니다';
			break;
		case 'auth/user-not-found':
			errorMessage = '존재하지 않는 계정입니다';
			break;
		case 'auth/wrong-password':
			errorMessage = '잘못된 비밀번호입니다';
			break;
		case 'auth/invalid-credential':
			errorMessage = '유효하지 않은 인증 정보입니다';
			break;
		case 'auth/too-many-requests':
			errorMessage = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요';
			break;
	}

	return errorMessage;
};
