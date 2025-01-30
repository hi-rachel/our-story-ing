// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FirebaseErrorCode =
	// 회원가입 관련 에러
	| 'auth/email-already-in-use' // 이미 사용 중인 이메일
	| 'auth/invalid-email' // 유효하지 않은 이메일 형식
	| 'auth/operation-not-allowed' // 해당 로그인 방식이 비활성화됨
	| 'auth/weak-password' // 비밀번호가 너무 약함
	// 로그인 관련 에러
	| 'auth/user-disabled' // 비활성화된 계정
	| 'auth/user-not-found' // 존재하지 않는 계정
	| 'auth/wrong-password' // 잘못된 비밀번호
	| 'auth/invalid-credential' // 유효하지 않은 인증 정보
	| 'auth/invalid-verification-code' // 유효하지 않은 인증 코드
	| 'auth/invalid-verification-id' // 유효하지 않은 인증 ID
	| 'auth/too-many-requests' // 너무 많은 요청 (일시적 차단)
	// 비밀번호 재설정 관련 에러
	| 'auth/expired-action-code' // 만료된 작업 코드
	| 'auth/invalid-action-code' // 유효하지 않은 작업 코드
	// 기타 에러
	| 'auth/network-request-failed' // 네트워크 오류
	| 'auth/popup-closed-by-user' // 팝업이 사용자에 의해 닫힘
	| 'auth/cancelled-popup-request' // 팝업 요청이 취소됨
	| 'auth/popup-blocked' // 팝업이 차단됨
	| 'auth/requires-recent-login'; // 최근 로그인이 필요함
