const HourglassHeartLoading = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-pink-100'>
			<div className='relative w-40 h-40'>
				{/* Top heart orbit */}
				<div className='absolute inset-0'>
					<div className='absolute left-1/2 -translate-x-1/2 animate-[topHeartOrbit_2s_linear_infinite]'>
						<svg className='w-10 h-10' viewBox='0 0 24 24' fill='none'>
							<path
								d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
								fill='currentColor'
								className='text-accent'
							/>
						</svg>
					</div>
				</div>

				{/* Bottom heart orbit */}
				<div className='absolute inset-0'>
					<div className='absolute left-1/2 -translate-x-1/2 bottom-0 animate-[bottomHeartOrbit_2s_linear_infinite]'>
						<svg className='w-10 h-10' viewBox='0 0 24 24' fill='none'>
							<path
								d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
								fill='currentColor'
								className='text-primary'
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HourglassHeartLoading;
