import { useState, useRef, useEffect } from 'react';
import IngPhotoPagePresentation from './IngPhotoPagePresentation';

// TODO
// 완료된 사진 firebase에 보관하기 (시간 제한)
// 사진 촬영 카운트다운 3초, 5초 설정하기
// 4개 모두 촬영 전 다운로드 막기 / 4개 모두 촬영 완료 후 밝기 조절, 흑백 선택
// 테마 사진 업데이트, 테마 선택 기능 구현
// 공유 기능

const IngPhotoPageContainer = () => {
	const [photos, setPhotos] = useState<(string | null)[]>([
		null,
		null,
		null,
		null,
	]);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isCapturing, setIsCapturing] = useState<number | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);
	const [brightness, setBrightness] = useState<number>(100);
	const [isGrayscale, setIsGrayscale] = useState<boolean>(false);

	const photoPositions = [
		{ top: 77, left: 19, width: 199, height: 282 },
		{ top: 77, left: 233, width: 199, height: 282 },
		{ top: 372, left: 19, width: 199, height: 282 },
		{ top: 372, left: 233, width: 199, height: 282 },
	];

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d');
		if (canvas && context) {
			const img = new window.Image();
			img.onload = () => {
				context.drawImage(img, 0, 0, canvas.width, canvas.height);
			};
			img.src = '/images/photo-pink.png';
		}
	}, []);

	// 사진 촬영 시작 및 3초 카운트다운
	const startCountdownAndCapture = async (index: number) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: 'user',
				},
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			}

			let count = 3;
			setCountdown(count);

			const countdownInterval = setInterval(() => {
				count -= 1;
				setCountdown(count);
				if (count === 0) {
					clearInterval(countdownInterval);
					setCountdown(null);
					capturePhoto(index);
				}
			}, 1000);
		} catch (error) {
			console.error('Error accessing camera:', error);
		}
	};

	// 사진 캡처 후 메인 캔버스에 그림
	const capturePhoto = (index: number) => {
		const video = videoRef.current;
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (context && video) {
			const { width, height } = photoPositions[index];
			canvas.width = width;
			canvas.height = height;

			let captureWidth = video.videoHeight * (width / height);
			let captureHeight = video.videoHeight;

			if (captureWidth > video.videoWidth) {
				captureWidth = video.videoWidth;
				captureHeight = video.videoWidth / (width / height);
			}

			const captureX = (video.videoWidth - captureWidth) / 2;
			const captureY = (video.videoHeight - captureHeight) / 2;

			// 사진에만 필터 적용
			context.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
			context.drawImage(
				video,
				captureX,
				captureY,
				captureWidth,
				captureHeight,
				0,
				0,
				width,
				height
			);

			const photo = canvas.toDataURL('image/png');
			const newPhotos = [...photos];
			newPhotos[index] = photo;
			setPhotos(newPhotos);

			// 비디오 스트림 종료
			const stream = video.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			video.srcObject = null;
			setIsCapturing(null);

			// 사진을 메인 캔버스에 그릴 때도 필터 적용
			const mainCanvas = canvasRef.current;
			const mainContext = mainCanvas?.getContext('2d');
			if (mainCanvas && mainContext) {
				const img = new window.Image();
				img.onload = () => {
					const { top, left, width, height } = photoPositions[index];
					// 사진 그릴 때만 필터 적용
					mainContext.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
					mainContext.drawImage(img, left, top, width, height);
				};
				img.src = photo;
			}
		}
	};

	// 다운로드 기능
	const handleDownload = () => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d');
		if (canvas && context) {
			const img = new window.Image();
			img.src = '/images/photo-pink.png';

			img.onload = () => {
				// 배경 이미지를 그릴 때 필터를 적용하지 않음
				context.filter = 'none'; // 필터 초기화
				context.drawImage(img, 0, 0, canvas.width, canvas.height);

				// 각 사진에만 필터 적용
				photos.forEach((photo, index) => {
					if (photo) {
						const img = new window.Image();
						img.src = photo;
						img.onload = () => {
							const { top, left, width, height } =
								photoPositions[index];
							// 필터 적용 (사진에만 적용)
							context.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
							context.drawImage(img, left, top, width, height);
						};
					}
				});

				// 다운로드
				setTimeout(() => {
					const link = document.createElement('a');
					link.href = canvas.toDataURL('image/png');
					link.download = 'combined-image.png';
					link.click();
				}, 500);
			};
		}
	};

	// 사진 촬영 핸들러
	const handleTakePhoto = (index: number) => {
		if (photos[index]) {
			const confirmRetake = window.confirm(
				'Do you want to retake the photo?'
			);
			if (!confirmRetake) return;
		}
		setIsCapturing(index);
		startCountdownAndCapture(index);
	};

	return (
		<IngPhotoPagePresentation
			videoRef={videoRef}
			canvasRef={canvasRef}
			photos={photos}
			isCapturing={isCapturing}
			countdown={countdown}
			brightness={brightness}
			isGrayscale={isGrayscale}
			handleTakePhoto={handleTakePhoto}
			handleDownload={handleDownload}
			setBrightness={setBrightness}
			setIsGrayscale={setIsGrayscale}
		/>
	);
};

export default IngPhotoPageContainer;
