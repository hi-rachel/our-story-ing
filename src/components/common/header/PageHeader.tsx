import React from 'react';
import BackButton from '../button/BackButton';

interface PageHeaderProps {
	title?: string;
	children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
	return (
		<header className='bg-white bg-opacity-95 shadow-sm fixed top-0 left-0 right-0 z-50'>
			<div className='max-w-7xl mx-auto'>
				<div className='relative flex items-center justify-between h-14 px-2 md:px-6'>
					<div className='absolute left-2'>
						<BackButton />
					</div>
					{title && (
						<div className='flex-1 flex justify-center'>
							<h1 className='text-md font-semibold text-primary'>{title}</h1>
						</div>
					)}
					{children}
				</div>
			</div>
		</header>
	);
};

export default PageHeader;
