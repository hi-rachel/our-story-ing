import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { auth } from '../../../../firebase';
import DefaultProfile from '@/components/common/profile/DefaultProfile';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const MainHeader = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const user = auth.currentUser;

	const handleLogOut = async () => {
		const ok = confirm(t('common.logoutConfirm'));
		if (ok) {
			try {
				await auth.signOut();
			} catch (error) {
				console.error('Error signing out: ', error);
			}
		}
	};

	return (
		<nav className='fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-sm z-50'>
			<div className='container mx-auto px-4 py-4 flex justify-between items-center'>
				<Link href='/' className='text-lg font-bold text-primary'>
					<div className='flex justify-center items-center gap-3'>
						<img
							src={'/icons/couple.svg'}
							alt='ing app logo'
							width={'30px'}
							height={'30px'}
						/>
						{t('common.appName')}
					</div>
				</Link>
				<div className='flex flex-wrap items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0'>
					{user ? (
						<div className='flex items-center space-x-4'>
							<Link href={'/profile'}>
								<div className='flex items-center space-x-2'>
									<DefaultProfile
										size={32}
										photoURL={user.photoURL ? user.photoURL : null}
									/>
									<span className='text-text font-semibold text-sm sm:text-base'>
										{user.displayName}
									</span>
								</div>
							</Link>
							<motion.button
								style={{ borderRadius: '9999px' }}
								onClick={handleLogOut}
								className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-background hover:text-primary transition duration-300 shadow-button'>
								{t('common.logout')}
							</motion.button>
						</div>
					) : (
						<motion.button
							whileHover={{ scale: 1.05 }}
							style={{ borderRadius: '9999px' }}
							onClick={() => router.push('/login')}
							className='block bg-gradient-to-r from-pink-400 to-purple-300 text-white px-5 py-3 rounded-full text-sm font-semibold h transition duration-300 shadow-button'>
							{t('common.login')}
						</motion.button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default MainHeader;
