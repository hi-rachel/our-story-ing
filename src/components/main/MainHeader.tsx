import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaUser } from 'react-icons/fa';

const MainHeader = () => {
	const router = useRouter();

	const handleBack = () => {
		router.back();
	};

	return (
		<header className='h-16 fixed top-0 left-0 right-0 bg-[#FFF9E6] bg-opacity-90 shadow-md z-50 flex justify-between items-center px-6 py-4'>
			<button
				onClick={handleBack}
				className='text-[#FF85A2] hover:text-[#FF5E5B] transition-colors'>
				<FaArrowLeft size={24} />
			</button>
			<Link
				href='/profile'
				className='text-[#FF85A2] hover:text-[#FF5E5B] transition-colors'>
				<FaUser size={24} />
			</Link>
		</header>
	);
};

export default MainHeader;
