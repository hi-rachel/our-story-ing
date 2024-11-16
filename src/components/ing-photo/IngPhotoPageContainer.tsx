import { useState, useRef, useEffect } from 'react';
import IngPhotoPagePresentation from './IngPhotoPagePresentation';
import { photoPositions } from '@/constants/photoPositions';
import { themes } from '@/constants/themes';
import type { FilterOptions } from './types';

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
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		brightness: 100,
		isGrayscale: false,
	});
	const [isSharing, setIsSharing] = useState(false);

	const getFilterStyle = (brightness: number, isGrayscale: boolean) => {
		const filters = [];
		if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
		if (isGrayscale) filters.push('grayscale(100%)');
		return filters.length > 0 ? filters.join(' ') : 'none';
	};

	const renderToCanvas = async (
		context: CanvasRenderingContext2D,
		shouldApplyFilter = true
	) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// Draw theme
		const themeImg = new Image();
		await new Promise((resolve, reject) => {
			themeImg.onload = () => {
				context.filter = 'none';
				context.drawImage(
					themeImg,
					0,
					0,
					context.canvas.width,
					context.canvas.height
				);
				resolve(true);
			};
			themeImg.onerror = reject;
			themeImg.src = currentTheme;
		});

		// Draw photos with filters
		if (shouldApplyFilter) {
			for (let i = 0; i < photos.length; i++) {
				const photo = photos[i];
				if (!photo) continue;

				await new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = () => {
						const { top, left, width, height } = photoPositions[i];
						context.filter = getFilterStyle(
							filterOptions.brightness,
							filterOptions.isGrayscale
						);
						context.drawImage(img, left * 2, top * 2, width * 2, height * 2);
						resolve(true);
					};
					img.onerror = reject;
					img.src = photo;
				});
			}
		}

		// Draw date
		context.filter = 'none';
		const today = new Date().toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
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

		renderToCanvas(context);
	}, [currentTheme, photos, filterOptions]);

	const handleTakePhoto = (index: number) => {
		if (photos[index]) {
			const confirmRetake = window.confirm('Do you want to retake this photo?');
			if (!confirmRetake) return;
		}
		setIsCapturing(index);
		startCountdownAndCapture(index);
	};

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

		const { width, height } = photoPositions[index];
		canvas.width = width * 2;
		canvas.height = height * 2;

		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = 'high';

		let captureWidth = video.videoHeight * (width / height);
		let captureHeight = video.videoHeight;

		if (captureWidth > video.videoWidth) {
			captureWidth = video.videoWidth;
			captureHeight = video.videoWidth / (width / height);
		}

		const captureX = (video.videoWidth - captureWidth) / 2;
		const captureY = (video.videoHeight - captureHeight) / 2;

		context.filter = getFilterStyle(
			filterOptions.brightness,
			filterOptions.isGrayscale
		);
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
	};

	const handleDownload = async () => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d', { alpha: false });
		if (!canvas || !context) return;

		try {
			await renderToCanvas(context);
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
			await renderToCanvas(context);

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

	const handleSetFilterOptions = (options: Partial<FilterOptions>) => {
		setFilterOptions((prev) => ({
			...prev,
			...options,
		}));
	};

	return (
		<IngPhotoPagePresentation
			videoRef={videoRef}
			canvasRef={canvasRef}
			photos={photos}
			isCapturing={isCapturing}
			countdown={countdown}
			filterOptions={filterOptions}
			handleTakePhoto={handleTakePhoto}
			handleDownload={handleDownload}
			handleShare={handleShare}
			setFilterOptions={handleSetFilterOptions}
			currentTheme={currentTheme}
			setCurrentTheme={setCurrentTheme}
			isSharing={isSharing}
			themes={themes}
		/>
	);
};

export default IngPhotoPageContainer;
