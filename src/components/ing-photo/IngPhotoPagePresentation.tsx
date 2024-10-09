import Image from 'next/image';
import { TiCamera } from 'react-icons/ti';
import { TbFileDownload, TbCameraShare } from 'react-icons/tb';

interface IngPhotoPagePresentationProps {
	videoRef: React.RefObject<HTMLVideoElement>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	photos: (string | null)[];
	isCapturing: number | null;
	countdown: number | null;
	brightness: number;
	isGrayscale: boolean;
	handleTakePhoto: (index: number) => void;
	handleDownload: () => void;
	setBrightness: (value: number) => void;
	setIsGrayscale: (value: boolean) => void;
}

const photoPositions = [
	{ top: 77, left: 19, width: 199, height: 282 },
	{ top: 77, left: 233, width: 199, height: 282 },
	{ top: 372, left: 19, width: 199, height: 282 },
	{ top: 372, left: 233, width: 199, height: 282 },
];

const IngPhotoPagePresentation: React.FC<IngPhotoPagePresentationProps> = ({
	videoRef,
	canvasRef,
	photos,
	isCapturing,
	countdown,
	brightness,
	isGrayscale,
	handleTakePhoto,
	handleDownload,
	setBrightness,
	setIsGrayscale,
}) => {
	return (
		<div className='min-w-[464px] flex items-center justify-center h-screen bg-slate-100 relative'>
			<div className='relative'>
				<Image
					alt='photo-theme'
					width={450}
					height={675}
					src='/images/photo-pink.png'
				/>

				{/* 각 사진 촬영 구역 */}
				{photoPositions.map((position, index) => (
					<div
						key={index}
						className='absolute'
						style={{
							top: position.top,
							left: position.left,
							width: position.width,
							height: position.height,
							overflow: 'hidden',
						}}
						onClick={() => handleTakePhoto(index)}>
						{isCapturing === index ? (
							<div className='relative w-full h-full'>
								<video
									ref={videoRef}
									autoPlay
									style={{
										width: position.width,
										height: position.height,
										objectFit: 'cover',
										filter: `brightness(${brightness}%) ${isGrayscale ? 'grayscale(100%)' : 'none'}`,
									}}
								/>
								{countdown !== null && (
									<div className='absolute inset-0 flex items-center justify-center'>
										<span className='text-white text-6xl font-bold'>
											{countdown}
										</span>
									</div>
								)}
							</div>
						) : photos[index] ? (
							<img
								src={photos[index] as string}
								alt={`Captured photo ${index + 1}`}
								style={{
									width: position.width,
									height: position.height,
									objectFit: 'cover',
									filter: `brightness(${brightness}%) grayscale(${isGrayscale ? 100 : 0}%`,
								}}
							/>
						) : (
							<div className='flex justify-center items-center w-full h-full'>
								<TiCamera size={50} />
							</div>
						)}
					</div>
				))}
				{/* 다운로드 및 공유 */}
				<div className='absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 flex space-x-6'>
					<div className='flex flex-col justify-center items-center'>
						<TbFileDownload size={30} onClick={handleDownload} />
						<span className='text-xs mt-1'>Download</span>
					</div>
					<div>
						<TbCameraShare size={30} />
						<span className='text-xs'>Share</span>
					</div>
				</div>
			</div>

			{/* 밝기 조절 슬라이더 */}
			<div className='absolute top-5 left-[40%] transform -translate-x-1/2 flex flex-col items-center'>
				<label className='mb-1'>Brightness</label>
				<input
					type='range'
					min='50'
					max='150'
					value={brightness}
					onChange={(e) => setBrightness(Number(e.target.value))}
					className='w-40'
				/>
			</div>

			{/* 흑백/컬러 전환 토글 */}
			<div className='absolute top-5 left-[60%] transform -translate-x-1/2 flex flex-col items-center'>
				<label className='mb-1'>Grayscale</label>
				<input
					type='checkbox'
					checked={isGrayscale}
					onChange={(e) => setIsGrayscale(e.target.checked)}
					className='toggle-checkbox'
				/>
			</div>
			{/* 숨겨진 캔버스 */}
			<canvas
				ref={canvasRef}
				width={450}
				height={675}
				style={{ display: 'none' }}></canvas>
		</div>
	);
};

export default IngPhotoPagePresentation;
