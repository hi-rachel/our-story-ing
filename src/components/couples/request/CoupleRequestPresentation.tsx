import { motion } from 'framer-motion';
import { CoupleRequestPresentationProps } from '../coupleTypes';

const CoupleRequestPresentation: React.FC<CoupleRequestPresentationProps> = ({
	inviter,
	error,
	loading,
	onAcceptInvitation,
	t,
}) => {
	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary'>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'linear',
					}}
					className='text-6xl mb-4'>
					💞
				</motion.div>
				<p className='text-xl text-primary font-semibold'>
					{t('common.loading')}
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-white p-8 rounded-large shadow-card'>
					<h1 className='text-2xl font-heading font-semibold text-error mb-4 text-center'>
						{error}
					</h1>
					<motion.button
						onClick={() => window.history.back()}
						className='bg-accent hover:bg-primary text-white font-bold py-2 px-4 rounded-large shadow-button transition-colors duration-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						{t('common.goBack')}
					</motion.button>
				</motion.div>
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white shadow-card rounded-large p-8'>
				{inviter ? (
					<>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								delay: 0.2,
								type: 'spring',
								stiffness: 260,
								damping: 20,
							}}
							className='text-7xl mb-6 text-center'>
							💌
						</motion.div>
						<h2 className='text-3xl font-heading font-semibold mb-6 text-center text-primary'>
							{inviter.displayName}{' '}
							{t('invitePartner.hasInvited')}
						</h2>
						<motion.button
							onClick={onAcceptInvitation}
							className='w-full p-4 bg-accent hover:bg-primary text-white rounded-large font-bold text-lg shadow-button transition-colors duration-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							{t('invitePartner.acceptInvitation')}
						</motion.button>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className='mt-6 text-center text-text text-lg'>
							{t('invitePartner.startJourney')}
						</motion.p>
					</>
				) : (
					<div className='text-center text-error'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								delay: 0.2,
								type: 'spring',
								stiffness: 260,
								damping: 20,
							}}
							className='text-7xl mb-6'>
							🚫
						</motion.div>
						<p className='text-xl font-semibold'>
							{t('invitePartner.invalidLink')}
						</p>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default CoupleRequestPresentation;
