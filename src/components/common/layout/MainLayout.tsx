import { ReactNode } from 'react';
import MainFooter from '../footer/MainFooter';

interface LayoutProps {
	children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
	return (
		<div className='relative min-h-screen'>
			<main className='pb-16'>{children}</main>{' '}
			{/* 패딩으로 Header와 Footer 공간 확보 */}
			<MainFooter />
		</div>
	);
};

export default MainLayout;
