import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { auth } from '../../../../firebase';
import DefaultProfile from '@/components/common/profile/DefaultProfile';
import { motion } from 'framer-motion';

const Header = () => {
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
		<nav className='fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-md z-50'>
			<div className='container mx-auto px-4 py-3 flex flex-wrap justify-between items-center'>
				<Link
					href='/'
					className='text-xl sm:text-2xl font-heading font-bold text-primary'>
					<img src={'/icons/couple.svg'} alt='ing app logo' />
					{t('common.appName')}
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
							<button
								onClick={handleLogOut}
								className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-background hover:text-primary transition duration-300 shadow-button'>
								{t('common.logout')}
							</button>
						</div>
					) : (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							<Link
								href='/login'
								className='bg-gradient-to-r from-pink-400 to-purple-300 text-white px-5 py-3 rounded-full text-sm font-semibold h transition duration-300 shadow-button'>
								{t('common.login')}
							</Link>
						</motion.button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Header;
