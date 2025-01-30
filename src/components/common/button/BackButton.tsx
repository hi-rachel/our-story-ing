import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const BackButton = () => {
	const router = useRouter();

	return (
		<button
			onClick={() => router.back()}
			className={
				'inline-flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors'
			}>
			<ChevronLeft size={20} />
			<span className='text-sm font-medium'>뒤로가기</span>
		</button>
	);
};

export default BackButton;
