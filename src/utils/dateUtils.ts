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
