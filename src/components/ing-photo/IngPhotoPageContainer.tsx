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
	// 원본 사진들을 저장할 state 추가
	const [originalPhotos, setOriginalPhotos] = useState<(string | null)[]>([
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

	const applyFilters = (
		sourceContext: CanvasRenderingContext2D,
		brightness: number,
		isGrayscale: boolean
	) => {
		const imageData = sourceContext.getImageData(
			0,
			0,
			sourceContext.canvas.width,
			sourceContext.canvas.height
		);
		const data = imageData.data;

		for (let i = 0; i < data.length; i += 4) {
			// 밝기 조정
			if (brightness !== 100) {
				const factor = brightness / 100;
				data[i] = Math.min(255, data[i] * factor); // Red
				data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
				data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
			}

			// 흑백 변환
			if (isGrayscale) {
				const gray =
					data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
				data[i] = gray; // Red
				data[i + 1] = gray; // Green
				data[i + 2] = gray; // Blue
			}
		}

		sourceContext.putImageData(imageData, 0, 0);
	};

	// 필터가 적용된 이미지 생성
	const createFilteredImage = async (
		originalImage: string,
		width: number,
		height: number,
		filterOptions: FilterOptions
	): Promise<string> => {
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = width;
		tempCanvas.height = height;
		const tempContext = tempCanvas.getContext('2d', { alpha: false });

		if (!tempContext) {
			throw new Error('Failed to get context');
		}

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				tempContext.drawImage(img, 0, 0, width, height);
				if (filterOptions.brightness !== 100 || filterOptions.isGrayscale) {
					applyFilters(
						tempContext,
						filterOptions.brightness,
						filterOptions.isGrayscale
					);
				}
				resolve(tempCanvas.toDataURL('image/png', 1.0));
			};
			img.onerror = reject;
			img.src = originalImage;
		});
	};

	// 모든 사진에 필터 적용
	const updateAllPhotos = async (options: FilterOptions) => {
		const updatedPhotos = await Promise.all(
			originalPhotos.map(async (photo, index) => {
				if (!photo) return null;
				const { width, height } = photoPositions[index];
				return createFilteredImage(photo, width * 2, height * 2, options);
			})
		);
		setPhotos(updatedPhotos);
	};

	const processAndDrawImage = async (
		context: CanvasRenderingContext2D,
		img: HTMLImageElement,
		x: number,
		y: number,
		width: number,
		height: number,
		filterOptions: FilterOptions
	) => {
		// 임시 캔버스 생성
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = width;
		tempCanvas.height = height;
		const tempContext = tempCanvas.getContext('2d', { alpha: false });

		if (!tempContext) return;

		// 이미지를 임시 캔버스에 그리기
		tempContext.drawImage(img, 0, 0, width, height);

		// 필터 적용
		if (filterOptions.brightness !== 100 || filterOptions.isGrayscale) {
			applyFilters(
				tempContext,
				filterOptions.brightness,
				filterOptions.isGrayscale
			);
		}

		// 필터가 적용된 이미지를 최종 캔버스에 그리기
		context.drawImage(tempCanvas, x, y);
	};

	const renderToCanvas = async (
		context: CanvasRenderingContext2D,
		photos: (string | null)[],
		currentTheme: string,
		filterOptions: FilterOptions
	) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// Draw theme
		await new Promise<void>((resolve, reject) => {
			const themeImg = new Image();
			themeImg.onload = () => {
				context.drawImage(
					themeImg,
					0,
					0,
					context.canvas.width,
					context.canvas.height
				);
				resolve();
			};
			themeImg.onerror = reject;
			themeImg.src = currentTheme;
		});

		// Draw photos with filters
		await Promise.all(
			photos.map((photo, index) => {
				if (!photo) return Promise.resolve();

				return new Promise<void>((resolve, reject) => {
					const img = new Image();
					img.onload = async () => {
						const { top, left, width, height } = photoPositions[index];
						await processAndDrawImage(
							context,
							img,
							left * 2,
							top * 2,
							width * 2,
							height * 2,
							filterOptions
						);
						resolve();
					};
					img.onerror = reject;
					img.src = photo;
				});
			})
		);

		// Draw date
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

	const createExportCanvas = async () => {
		const exportCanvas = document.createElement('canvas');
		exportCanvas.width = 450 * 2;
		exportCanvas.height = 675 * 2;
		const exportContext = exportCanvas.getContext('2d', { alpha: false });

		if (!exportContext) {
			throw new Error('Failed to get export canvas context');
		}

		exportContext.imageSmoothingEnabled = true;
		exportContext.imageSmoothingQuality = 'high';

		await renderToCanvas(exportContext, photos, currentTheme, filterOptions);

		return exportCanvas;
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

		renderToCanvas(context, photos, currentTheme, filterOptions);
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

	const capturePhoto = async (index: number) => {
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

		// 원본 이미지 캡처
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

		// 원본 이미지 저장
		const originalPhoto = canvas.toDataURL('image/png', 1.0);
		const newOriginalPhotos = [...originalPhotos];
		newOriginalPhotos[index] = originalPhoto;
		setOriginalPhotos(newOriginalPhotos);

		// 필터 적용된 이미지 생성 및 저장
		const filteredPhoto = await createFilteredImage(
			originalPhoto,
			width * 2,
			height * 2,
			filterOptions
		);
		const newPhotos = [...photos];
		newPhotos[index] = filteredPhoto;
		setPhotos(newPhotos);

		const stream = video.srcObject as MediaStream;
		stream.getTracks().forEach((track) => track.stop());
		video.srcObject = null;
		setIsCapturing(null);
	};

	const handleDownload = async () => {
		try {
			const exportCanvas = await createExportCanvas();

			const link = document.createElement('a');
			link.download = `photo-booth-${new Date().toISOString()}.png`;
			link.href = exportCanvas.toDataURL('image/png', 1.0);
			link.click();
		} catch (error) {
			console.error('Error during download:', error);
			alert('Failed to download image. Please try again.');
		}
	};

	const handleShare = async () => {
		try {
			setIsSharing(true);

			const exportCanvas = await createExportCanvas();

			const blob = await new Promise<Blob>((resolve) =>
				exportCanvas.toBlob((blob) => blob && resolve(blob), 'image/png', 1.0)
			);

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

	const handleSetFilterOptions = async (options: Partial<FilterOptions>) => {
		const newOptions = { ...filterOptions, ...options };
		setFilterOptions(newOptions);
		await updateAllPhotos(newOptions);
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
