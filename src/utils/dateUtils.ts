// 날짜/시간 포맷 함수 (24.09.10 오후 10:11 형식으로 변환)
export const formatDate = (date: Date): string => {
	const dateString = date.toLocaleDateString('ko-KR', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
	});
	const timeString = date.toLocaleTimeString('ko-KR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
	return `${dateString} ${timeString}`;
};

export const calculateDaysSinceAnniversary = (
	anniversaryDate: string
): number => {
	const today = new Date();
	const anniversary = new Date(anniversaryDate);

	// 두 날짜 사이의 차이를 밀리초로 계산
	const diffTime = Math.abs(today.getTime() - anniversary.getTime());

	// 밀리초를 일수로 변환
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
};
