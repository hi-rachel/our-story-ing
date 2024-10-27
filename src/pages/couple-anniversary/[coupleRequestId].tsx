import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

const CoupleAnniversary: React.FC = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const { coupleRequestId } = router.query;
	const [anniversaryDate, setAnniversaryDate] = useState('');

	const handleAnniversarySubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!anniversaryDate) {
			toast.error(t('anniversary.enterDate'));
			return;
		}

		try {
			const coupleRef = doc(db, 'couples', coupleRequestId as string);
			await updateDoc(coupleRef, {
				anniversary: anniversaryDate,
			});
			toast.success(t('anniversary.dateSaved'));

			router.push(`/couple-chat/${coupleRequestId}`);
		} catch (error) {
			console.error('Error saving anniversary:', error);
			toast.error(t('anniversary.errorSaving'));
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-background'>
			<h1 className='text-2xl mb-4'>{t('anniversary.setAnniversary')}</h1>
			<form onSubmit={handleAnniversarySubmit}>
				<input
					type='date'
					value={anniversaryDate}
					onChange={(e) => setAnniversaryDate(e.target.value)}
					className='border rounded p-2 mb-4'
				/>
				<button type='submit' className='bg-primary text-white p-2 rounded'>
					{t('anniversary.saveDate')}
				</button>
			</form>
		</div>
	);
};

export default CoupleAnniversary;
