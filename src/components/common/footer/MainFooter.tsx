import Link from 'next/link';
import { FaHome, FaCommentDots, FaCamera } from 'react-icons/fa';

const MainFooter = () => {
	return (
		<footer className='h-16 fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-md z-50 flex justify-around items-center py-4'>
			<Link
				href='/'
				className='text-[#FF85A2] hover:text-[#FF5E5B] transition-colors'>
				<FaHome size={24} />
			</Link>
			<Link
				href='/chat'
				className='text-[#FF85A2] hover:text-[#FF5E5B] transition-colors'>
				<FaCommentDots size={24} />
			</Link>
			<Link
				href='/ing-photo'
				className='text-[#FF85A2] hover:text-[#FF5E5B] transition-colors'>
				<FaCamera size={24} />
			</Link>
		</footer>
	);
};

export default MainFooter;
