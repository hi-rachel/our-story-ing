import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaCommentDots, FaCamera } from 'react-icons/fa';
import { BsFillChatHeartFill } from 'react-icons/bs';
import { UserData } from '@/types/user';
import { User } from 'firebase/auth';
import { auth, db } from '../../../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const MainFooter = () => {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
			if (!currentUser) {
				setUserData(null);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		let unsubscribe: () => void;

		if (user?.uid) {
			const userDocRef = doc(db, 'users', user.uid);

			unsubscribe = onSnapshot(userDocRef, (doc) => {
				if (doc.exists()) {
					setUserData(doc.data() as UserData);
				} else {
					setUserData(null);
				}
			});
		}

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [user?.uid]);

	const renderCoupleChat = () => {
		const isCouple = userData?.isCouple && userData?.coupleId;

		if (isCouple) {
			return (
				<Link href={`/couple-chat/${userData.coupleId}`} className='group'>
					<div className='w-12 h-12 flex items-center justify-center text-primary hover:text-primary-dark transition-colors duration-300'>
						<BsFillChatHeartFill size={28} />
					</div>
				</Link>
			);
		}

		return (
			<div className='group relative'>
				<div className='w-12 h-12 flex items-center justify-center text-muted cursor-not-allowed'>
					<BsFillChatHeartFill size={28} />
				</div>
				<div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity'>
					커플 매칭 후 이용 가능합니다
				</div>
			</div>
		);
	};

	return (
		<footer className='h-16 fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-md z-50 flex justify-around items-center'>
			<Link href='/' className='group'>
				<div className='w-12 h-12 flex items-center justify-center text-primary hover:text-primary-dark transition-colors duration-300'>
					<FaHome size={28} />
				</div>
			</Link>
			<Link href='/chat' className='group'>
				<div className='w-12 h-12 flex items-center justify-center text-primary hover:text-primary-dark transition-colors duration-300'>
					<FaCommentDots size={28} />
				</div>
			</Link>
			{renderCoupleChat()}
			<Link href='/ing-photo' className='group'>
				<div className='w-12 h-12 flex items-center justify-center text-primary hover:text-primary-dark transition-colors duration-300'>
					<FaCamera size={28} />
				</div>
			</Link>
		</footer>
	);
};

export default MainFooter;
