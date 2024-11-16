import React, { useState } from 'react';
import { InfoIcon, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const PhotoBoothInfo = () => {
	const [isOpen, setIsOpen] = useState(false);

	const instructions = [
		'4분할 사진 영역을 각각 선택하면 3초 자동 촬영이 시작됩니다.',
		'사진은 서버에 저장되지 않아 사생활 보호에 안전합니다. 새로고침 시 사진이 삭제되니 반드시 다운로드나 공유 기능을 이용해주세요.',
		'사진 촬영 후 밝기 조절과 흑백 필터를 적용할 수 있습니다.',
		'원하는 테마를 선택하여 사진 프레임을 변경할 수 있습니다.',
		'완성된 사진은 기기에 저장하거나 공유할 수 있습니다.',
		'재촬영이 필요한 경우 해당 영역을 다시 클릭하면 됩니다.',
	];

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors'
				aria-label='사용 안내'>
				<InfoIcon className='w-6 h-6 text-gray-600' />
			</button>

			{isOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
					<div className='bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto'>
						<div className='p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-xl font-semibold text-gray-900'>
									사용 안내
								</h2>
								<button
									onClick={() => setIsOpen(false)}
									className='p-1 hover:bg-gray-100 rounded-full transition-colors'
									aria-label='닫기'>
									<X className='w-5 h-5 text-gray-500' />
								</button>
							</div>

							<div className='space-y-4'>
								{instructions.map((instruction, index) => (
									<Alert
										key={index}
										className='bg-white border-l-4 border-blue-500'>
										<AlertTitle className='text-sm font-medium text-gray-900'>
											Step {index + 1}
										</AlertTitle>
										<AlertDescription className='text-sm text-gray-600'>
											{instruction}
										</AlertDescription>
									</Alert>
								))}
							</div>

							<div className='mt-6 text-xs text-gray-500 text-center'>
								문제가 발생하면 페이지를 새로고침 해주세요.
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PhotoBoothInfo;
