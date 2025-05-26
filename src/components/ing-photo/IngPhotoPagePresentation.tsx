import React from 'react';
import Image from 'next/image';
import { TiCamera } from 'react-icons/ti';
import { TbFileDownload, TbCameraShare, TbLoader } from 'react-icons/tb';
import { photoPositions } from '@/constants/photoPositions';
import PhotoBoothInfo from './PhotoBoothInfo';
import type { Theme } from './types';
import type { FilterOptions } from './types';
import PageHeader from '../common/header/PageHeader';

interface IngPhotoPagePresentationProps {
	videoRef: React.RefObject<HTMLVideoElement>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	photos: (string | null)[];
	isCapturing: number | null;
	countdown: number | null;
	filterOptions: FilterOptions;
	handleTakePhoto: (index: number) => void;
	handleDownload: () => void;
	handleShare: () => Promise<void>;
	setFilterOptions: (options: Partial<FilterOptions>) => void;
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
	filterOptions,
	handleTakePhoto,
	handleDownload,
	handleShare,
	setFilterOptions,
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

	const renderPhotoArea = (index: number) => {
		if (isCapturing === index) {
			return (
				<div className='relative w-full h-full'>
					<video
						ref={videoRef}
						autoPlay
						playsInline
						className='w-full h-full object-cover'
					/>
					{countdown !== null && (
						<div className='absolute inset-0 flex items-center justify-center bg-black/30'>
							<span className='text-white text-5xl md:text-6xl font-bold'>
								{countdown}
							</span>
						</div>
					)}
				</div>
			);
		}

		if (photos[index]) {
			return (
				<img
					src={photos[index] as string}
					alt={`Captured photo ${index + 1}`}
					className='w-full h-full object-cover'
				/>
			);
		}

		return (
			<div className='flex justify-center items-center w-full h-full bg-gray-100/80 hover:bg-gray-200/80 transition-colors backdrop-blur-sm'>
				<TiCamera
					className='text-gray-400 transition-transform group-hover:scale-110'
					size={40}
				/>
			</div>
		);
	};

	return (
		<div className='min-h-screen bg-slate-50'>
			<PageHeader title='Photo Booth'>
				<PhotoBoothInfo />
			</PageHeader>

			<div className='max-w-7xl mx-auto p-4 md:p-8 pt-6 lg:min-h-[calc(100vh-3.5rem)] lg:flex lg:items-center lg:justify-center'>
				<div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
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

							{photoPositions.map((position, index) => (
								<div
									key={index}
									className='absolute cursor-pointer hover:opacity-90 transition-opacity overflow-hidden'
									style={{
										top: `${(position.top / 675) * 100}%`,
										left: `${(position.left / 450) * 100}%`,
										width: `${(position.width / 450) * 100}%`,
										height: `${(position.height / 675) * 100}%`,
									}}
									onClick={() => handleTakePhoto(index)}>
									{renderPhotoArea(index)}
								</div>
							))}

							<div className='absolute bottom-2 right-4 text-black text-xs font-medium'>
								{today}
							</div>
						</div>
						<p className='mt-4 text-sm text-gray-500 text-center'>
							사진은 서버에 저장되지 않아 다른 사람이 볼 수 없습니다.
						</p>
					</div>

					<div className='flex flex-col gap-4 lg:gap-6 lg:w-80'>
						<div className='bg-transparent rounded-2xl shadow-lg shadow-slate-200/50 flex flex-col overflow-x-hidden pb-5'>
							<h3 className='mt-5 ml-5 text-sm font-bold text-gray-900'>
								테마 선택
							</h3>

							<div
								className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto overflow-x-hidden p-5'
								style={{ maxHeight: '500px', minHeight: '200px' }}>
								{themes.map((theme) => (
									<button
										key={theme.id}
										onClick={() => setCurrentTheme(theme.path)}
										data-selected={theme.path === currentTheme}
										className='relative border border-gray-200 shadow-sm aspect-square rounded-xl overflow-hidden box-border transition-all'
										title={theme.name}>
										<Image
											src={theme.path}
											alt={theme.name}
											fill
											className='object-cover'
											sizes='100px'
										/>
									</button>
								))}
							</div>
						</div>

						<div className='bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-5'>
							<h3 className='text-sm font-bold text-gray-900 mb-4'>
								이미지 조정
							</h3>

							<div className='mb-5'>
								<label className='font-medium text-xs text-gray-600 mb-2 block'>
									밝기
								</label>
								<input
									type='range'
									min='50'
									max='150'
									value={filterOptions.brightness}
									onChange={(e) =>
										setFilterOptions({ brightness: Number(e.target.value) })
									}
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

							<div className='flex items-center justify-between'>
								<label className='font-medium text-xs text-gray-600'>
									흑백
								</label>
								<label className='relative inline-flex items-center cursor-pointer'>
									<input
										type='checkbox'
										checked={filterOptions.isGrayscale}
										onChange={(e) =>
											setFilterOptions({ isGrayscale: e.target.checked })
										}
										className='sr-only peer'
									/>
									<div className='w-11 h-6 bg-gray-100 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-blue-500'></div>
								</label>
							</div>
						</div>

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
