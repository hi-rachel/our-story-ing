import { useState, useRef, useEffect } from 'react';
import IngPhotoPagePresentation from './IngPhotoPagePresentation';
import { photoPositions } from '@/constants/photoPositions';
import { themes } from '@/constants/themes';

const IngPhotoPageContainer = () => {
	const [photos, setPhotos] = useState<(string | null)[]>([
		null,
		null,
		null,
		null,
	]);
	const [currentTheme, setCurrentTheme] = useState(
		'/images/ing-photo/theme-mint.png'
	);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isCapturing, setIsCapturing] = useState<number | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);
	const [brightness, setBrightness] = useState<number>(100);
	const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
	const [isSharing, setIsSharing] = useState(false);

	const drawTheme = (context: CanvasRenderingContext2D) => {
		return new Promise<void>((resolve, reject) => {
			const img = new window.Image();
			img.onload = () => {
				context.filter = 'none'; // 테마에는 필터를 적용하지 않음
				context.drawImage(
					img,
					0,
					0,
					context.canvas.width,
					context.canvas.height
				);
				resolve();
			};
			img.onerror = reject;
			img.src = currentTheme;
		});
	};

	const drawPhotos = (context: CanvasRenderingContext2D) => {
		const promises = photos.map((photo, index) => {
			if (!photo) return Promise.resolve();

			return new Promise<void>((resolve, reject) => {
				const img = new window.Image();
				img.onload = () => {
					const { top, left, width, height } = photoPositions[index];
					context.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
					context.drawImage(img, left * 2, top * 2, width * 2, height * 2);
					resolve();
				};
				img.onerror = reject;
				img.src = photo;
			});
		});

		return Promise.all(promises);
	};

	const drawDate = (context: CanvasRenderingContext2D) => {
		const today = new Date().toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});

		context.filter = 'none'; // 날짜에는 필터를 적용하지 않음
		context.font = 'bold 20px Arial';
		context.fillStyle = 'black';
		context.textAlign = 'right';
		context.fillText(
			today,
			context.canvas.width - 32,
			context.canvas.height - 30
		);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext('2d', { alpha: false });
		if (!context) return;

		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = 'high';

		canvas.width = 450 * 2;
		canvas.height = 675 * 2;

		const updateCanvas = async () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			await drawTheme(context);
			await drawPhotos(context);
			drawDate(context);
		};

		updateCanvas();
	}, [currentTheme, photos, brightness, isGrayscale]);

	const startCountdownAndCapture = async (index: number) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1920 },
					height: { ideal: 1080 },
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
			alert(
				'Failed to access camera. Please make sure you have given camera permission.'
			);
		}
	};

	const capturePhoto = (index: number) => {
		const video = videoRef.current;
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d', { alpha: false });
		if (!context || !video) return;

		// 캔버스 컨텍스트 초기화 설정
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = 'high';

		const { width, height } = photoPositions[index];
		canvas.width = width * 2;
		canvas.height = height * 2;

		let captureWidth = video.videoHeight * (width / height);
		let captureHeight = video.videoHeight;

		if (captureWidth > video.videoWidth) {
			captureWidth = video.videoWidth;
			captureHeight = video.videoWidth / (width / height);
		}

		const captureX = (video.videoWidth - captureWidth) / 2;
		const captureY = (video.videoHeight - captureHeight) / 2;

		context.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
		context.drawImage(
			video,
			captureX,
			captureY,
			captureWidth,
			captureHeight,
			0,
			0,
			canvas.width,
			canvas.height
		);

		const photo = canvas.toDataURL('image/png', 1.0);
		const newPhotos = [...photos];
		newPhotos[index] = photo;
		setPhotos(newPhotos);

		const stream = video.srcObject as MediaStream;
		stream.getTracks().forEach((track) => track.stop());
		video.srcObject = null;
		setIsCapturing(null);

		const mainCanvas = canvasRef.current;
		const mainContext = mainCanvas?.getContext('2d', { alpha: false });
		if (mainCanvas && mainContext) {
			const img = new window.Image();
			img.onload = () => {
				const { top, left, width, height } = photoPositions[index];
				mainContext.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
				mainContext.drawImage(img, left * 2, top * 2, width * 2, height * 2);
			};
			img.src = photo;
		}
	};

	const handleTakePhoto = (index: number) => {
		if (photos[index]) {
			const confirmRetake = window.confirm('Do you want to retake this photo?');
			if (!confirmRetake) return;
		}
		setIsCapturing(index);
		startCountdownAndCapture(index);
	};

	const handleDownload = async () => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d', { alpha: false });

		if (!canvas || !context) return;

		try {
			// 캔버스 초기화
			context.clearRect(0, 0, canvas.width, canvas.height);

			// 배경 이미지 로드 및 그리기를 Promise로 래핑
			await new Promise((resolve, reject) => {
				const bgImg = new Image();
				bgImg.onload = () => {
					context.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
					resolve(true);
				};
				bgImg.onerror = reject;
				bgImg.src = currentTheme;
			});

			// 모든 사진 로드 및 그리기를 Promise 배열로 처리
			const photoPromises = photos.map((photo, index) => {
				if (!photo) return Promise.resolve();

				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = () => {
						const { top, left, width, height } = photoPositions[index];
						context.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
						context.drawImage(img, left * 2, top * 2, width * 2, height * 2);
						resolve(true);
					};
					img.onerror = reject;
					img.src = photo;
				});
			});

			// 모든 사진이 로드될 때까지 대기
			await Promise.all(photoPromises);

			// 날짜 추가
			const today = new Date().toLocaleDateString('ko-KR', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			});

			context.font = 'bold 20px Arial';
			context.fillStyle = 'black';
			context.textAlign = 'right';
			context.fillText(today, canvas.width - 32, canvas.height - 30);

			// 다운로드
			const link = document.createElement('a');
			link.download = `photo-booth-${new Date().toISOString()}.png`;
			link.href = canvas.toDataURL('image/png', 1.0);
			link.click();
		} catch (error) {
			console.error('Error during download:', error);
			alert('Failed to download image. Please try again.');
		}
	};

	const handleShare = async () => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d', { alpha: false });
		if (!canvas || !context) return;

		try {
			setIsSharing(true);

			// 캔버스 초기화
			context.clearRect(0, 0, canvas.width, canvas.height);

			// 배경 이미지 로드 및 그리기
			await new Promise((resolve, reject) => {
				const bgImg = new Image();
				bgImg.onload = () => {
					context.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
					resolve(true);
				};
				bgImg.onerror = reject;
				bgImg.src = currentTheme;
			});

			// 사진 로드 및 그리기
			const photoPromises = photos.map((photo, index) => {
				if (!photo) return Promise.resolve();

				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = () => {
						const { top, left, width, height } = photoPositions[index];
						context.filter = `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%)`;
						context.drawImage(img, left * 2, top * 2, width * 2, height * 2);
						resolve(true);
					};
					img.onerror = reject;
					img.src = photo;
				});
			});

			await Promise.all(photoPromises);

			// 날짜 추가
			const today = new Date().toLocaleDateString('ko-KR', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			});

			context.font = 'bold 20px Arial';
			context.fillStyle = 'black';
			context.textAlign = 'right';
			context.fillText(today, canvas.width - 32, canvas.height - 30);

			// 캔버스를 Blob으로 변환
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob(
					(blob) => {
						if (blob) resolve(blob);
					},
					'image/png',
					1.0
				);
			});

			const file = new File([blob], 'photo-booth.png', { type: 'image/png' });

			if (navigator.share) {
				await navigator.share({
					files: [file],
					title: 'Photo Booth Picture',
					text: 'Check out my photo booth pictures!',
				});
			} else {
				const clipboardItem = new ClipboardItem({ 'image/png': blob });
				await navigator.clipboard.write([clipboardItem]);
				alert('Image copied to clipboard!');
			}
		} catch (error) {
			console.error('Error sharing:', error);
			alert('Failed to share image. Please try again.');
		} finally {
			setIsSharing(false);
		}
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
			handleShare={handleShare}
			setBrightness={setBrightness}
			setIsGrayscale={setIsGrayscale}
			currentTheme={currentTheme}
			setCurrentTheme={setCurrentTheme}
			isSharing={isSharing}
			themes={themes}
		/>
	);
};

export default IngPhotoPageContainer;
