import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';

interface BackButtonProps {
	className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
	const router = useRouter();

	return (
		<button
			onClick={() => router.back()}
			className={`inline-flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}>
			<ChevronLeft size={20} />
			<span className='text-sm font-medium'>뒤로가기</span>
		</button>
	);
};

export default BackButton;
