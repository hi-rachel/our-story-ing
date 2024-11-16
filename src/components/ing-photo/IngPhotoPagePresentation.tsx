import React from 'react';
import Image from 'next/image';
import { TiCamera } from 'react-icons/ti';
import { TbFileDownload, TbCameraShare, TbLoader } from 'react-icons/tb';
import { photoPositions } from '@/constants/photoPositions';
import type { Theme } from '@/types/theme';
import PhotoBoothInfo from './PhotoBoothInfo';
import BackButton from '../common/button/BackButton';

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
	handleShare: () => Promise<void>;
	setBrightness: (value: number) => void;
	setIsGrayscale: (value: boolean) => void;
	currentTheme: string;
	setCurrentTheme: (theme: string) => void;
	isSharing: boolean;
	themes: Theme[];
}

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
	handleShare,
	setBrightness,
	setIsGrayscale,
	currentTheme,
	setCurrentTheme,
	isSharing,
	themes,
}) => {
	const today = new Date().toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	const hasPhotos = photos.some((photo) => photo !== null);

	return (
		<div className='min-h-screen bg-slate-50'>
			{/* 상단 네비게이션 영역 */}
			<div className='sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100'>
				<div className='max-w-7xl mx-auto'>
					<div className='relative flex items-center justify-between h-14 px-2 md:px-6'>
						<div className='absolute left-2'>
							<BackButton />
						</div>
						<div className='flex-1 flex justify-center'>
							<div className='relative inline-block'>
								<PhotoBoothInfo />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 메인 컨테이너 */}
			<div className='max-w-7xl mx-auto p-4 md:p-8 pt-6 lg:min-h-[calc(100vh-3.5rem)] lg:flex lg:items-center lg:justify-center'>
				<div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
					{/* 포토 프레임 */}
					<div className='relative w-full max-w-[450px] mx-auto lg:mx-0'>
						<div className='relative overflow-hidden shadow-xl'>
							<Image
								alt='photo-theme'
								width={450}
								height={675}
								src={
									themes.find((theme) => theme.path === currentTheme)?.path ||
									'/images/ing-photo/theme-mint.png'
								}
								className='w-full h-auto'
							/>

							{/* 사진 촬영 영역 */}
							{photoPositions.map((position, index) => {
								const relativePosition = {
									top: `${(position.top / 675) * 100}%`,
									left: `${(position.left / 450) * 100}%`,
									width: `${(position.width / 450) * 100}%`,
									height: `${(position.height / 675) * 100}%`,
								};

								return (
									<div
										key={index}
										className='absolute cursor-pointer hover:opacity-90 transition-opacity overflow-hidden'
										style={relativePosition}
										onClick={() => handleTakePhoto(index)}>
										{isCapturing === index ? (
											<div className='relative w-full h-full'>
												<video
													ref={videoRef}
													autoPlay
													className='w-full h-full object-cover'
													style={{
														filter: `brightness(${brightness}%) ${
															isGrayscale ? 'grayscale(100%)' : 'none'
														}`,
													}}
												/>
												{countdown !== null && (
													<div className='absolute inset-0 flex items-center justify-center bg-black/30'>
														<span className='text-white text-5xl md:text-6xl font-bold'>
															{countdown}
														</span>
													</div>
												)}
											</div>
										) : photos[index] ? (
											<img
												src={photos[index] as string}
												alt={`Captured photo ${index + 1}`}
												className='w-full h-full object-cover'
												style={{
													filter: `brightness(${brightness}%) grayscale(${
														isGrayscale ? 100 : 0
													}%`,
												}}
											/>
										) : (
											<div className='flex justify-center items-center w-full h-full bg-gray-100/80 hover:bg-gray-200/80 transition-colors backdrop-blur-sm'>
												<TiCamera
													className='text-gray-400 transition-transform group-hover:scale-110'
													size={40}
												/>
											</div>
										)}
									</div>
								);
							})}

							{/* 날짜 표시 */}
							<div className='absolute bottom-2 right-4 text-black text-xs font-medium'>
								{today}
							</div>
						</div>
					</div>

					{/* 컨트롤 패널 */}
					<div className='flex flex-col gap-4 lg:gap-6 lg:w-80'>
						{/* 테마 선택 */}
						<div className='bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-5'>
							<h3 className='text-sm font-bold text-gray-900 mb-4'>
								테마 선택
							</h3>
							<div className='grid grid-cols-3 gap-3 lg:grid-cols-2'>
								{themes.map((theme) => (
									<button
										key={theme.id}
										onClick={() => setCurrentTheme(theme.path)}
										className={`aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
											currentTheme === theme.path
												? 'border-blue-500 ring-4 ring-blue-50'
												: 'border-transparent hover:border-blue-200'
										} ${theme.color}`}
										title={theme.name}
									/>
								))}
							</div>
						</div>

						{/* 이미지 조정 */}
						<div className='bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-5'>
							<h3 className='text-sm font-bold text-gray-900 mb-4'>
								이미지 조정
							</h3>

							{/* 밝기 조절 */}
							<div className='mb-5'>
								<label className='font-medium text-xs text-gray-600 mb-2 block'>
									밝기
								</label>
								<input
									type='range'
									min='50'
									max='150'
									value={brightness}
									onChange={(e) => setBrightness(Number(e.target.value))}
									className='w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:bg-blue-500 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md'
								/>
							</div>

							{/* 흑백 토글 */}
							<div className='flex items-center justify-between'>
								<label className='font-medium text-xs text-gray-600'>
									흑백
								</label>
								<label className='relative inline-flex items-center cursor-pointer'>
									<input
										type='checkbox'
										checked={isGrayscale}
										onChange={(e) => setIsGrayscale(e.target.checked)}
										className='sr-only peer'
									/>
									<div
										className="w-11 h-6 bg-gray-100 
                    peer-focus:outline-none 
                    peer-focus:ring-4 
                    peer-focus:ring-blue-100 
                    rounded-full peer 
                    peer-checked:after:translate-x-full 
                    peer-checked:after:border-white 
                    after:content-[''] 
                    after:absolute 
                    after:top-[2px] 
                    after:left-[2px] 
                    after:bg-white 
                    after:border-gray-300 
                    after:border 
                    after:rounded-full 
                    after:h-5 
                    after:w-5 
                    after:transition-all
                    after:shadow-sm
                    peer-checked:bg-blue-500"></div>
								</label>
							</div>
						</div>

						{/* 다운로드 및 공유 버튼 */}
						<div className='flex gap-3'>
							<button
								onClick={handleDownload}
								disabled={!hasPhotos}
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white transition-all hover:bg-blue-600 shadow-lg shadow-blue-500/25
                  ${!hasPhotos ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
								<TbFileDownload size={20} />
								<span className='text-sm font-medium'>다운로드</span>
							</button>

							<button
								onClick={handleShare}
								disabled={!hasPhotos || isSharing}
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white transition-all hover:bg-green-600 shadow-lg shadow-green-500/25
                  ${!hasPhotos || isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
								{isSharing ? (
									<TbLoader size={20} className='animate-spin' />
								) : (
									<TbCameraShare size={20} />
								)}
								<span className='text-sm font-medium'>공유하기</span>
							</button>
						</div>
					</div>

					{/* 숨겨진 캔버스 */}
					<canvas
						ref={canvasRef}
						width={450}
						height={675}
						style={{ display: 'none' }}
					/>
				</div>
			</div>
		</div>
	);
};

export default IngPhotoPagePresentation;
