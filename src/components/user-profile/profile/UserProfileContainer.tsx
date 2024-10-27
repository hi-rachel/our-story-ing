import { useState, useEffect } from 'react';
import { auth, db, storage } from '../../../../firebase';
import { User, deleteUser, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import UserProfilePresentation from './UserProfilePresentation';
import { useTranslation } from 'next-i18next';
import { EditedUser } from '../profileTypes';
import { UserData } from '@/types/user';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';

const UserProfileContainer = () => {
	const user = auth.currentUser as User | null;
	const [isEditing, setIsEditing] = useState(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [editedUser, setEditedUser] = useState<EditedUser>({
		displayName: user?.displayName || 'Anonymous',
		email: user?.email || '',
		photoURL: user?.photoURL || null,
		profileMessage: '',
		isCouple: false,
		partnerId: '',
		anniversary: '',
	});
	const [partnerName, setPartnerName] = useState<string | null>(null);
	const [loadingPartner, setLoadingPartner] = useState<boolean>(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	// Fetch user data and couple data (including anniversary)
	useEffect(() => {
		const fetchUserData = async () => {
			if (user) {
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					const data = userDoc.data() as UserData;
					setUserData(data);

					// Fetch couple data if user is in a couple
					if (data.isCouple && data.coupleId) {
						const coupleDoc = await getDoc(doc(db, 'couples', data.coupleId));
						if (coupleDoc.exists()) {
							const coupleData = coupleDoc.data();
							setEditedUser({
								...editedUser,
								displayName: user.displayName || 'Anonymous',
								photoURL: user.photoURL || null,
								profileMessage: data.profileMessage || '',
								isCouple: data.isCouple || false,
								partnerId: data.partnerId || '',
								anniversary: coupleData?.anniversary || '',
							});
						}
					}
				}
			}
		};

		fetchUserData();
	}, [user]);

	// 파트너 이름 가져오기
	useEffect(() => {
		const fetchPartnerName = async () => {
			if (userData?.partnerId) {
				setLoadingPartner(true);
				try {
					const partnerDoc = await getDoc(doc(db, 'users', userData.partnerId));
					if (partnerDoc.exists()) {
						const partnerData = partnerDoc.data();
						if (partnerData && partnerData.displayName) {
							setPartnerName(partnerData.displayName);
						} else {
							setPartnerName('Unknown Partner');
						}
					} else {
						setPartnerName(null);
					}
				} catch (error) {
					setPartnerName(null);
				} finally {
					setLoadingPartner(false);
				}
			}
		};

		if (userData?.isCouple && userData?.partnerId) {
			fetchPartnerName();
		}
	}, [userData?.isCouple, userData?.partnerId]);

	// Handle input change for editing profile
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
	};

	// Handle anniversary change
	const handleAnniversaryChange = (date: Date | null) => {
		setEditedUser((prev) => ({
			...prev,
			anniversary: date ? date.toISOString().substring(0, 10) : '',
		}));
	};

	// Handle image upload
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && user) {
			const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

			if (file.size > MAX_FILE_SIZE) {
				setError(t('profile.errorFileSizeExceeded'));
				return;
			}

			const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

			// Upload the image to Firebase Storage
			await uploadBytes(storageRef, file);

			// Get the download URL for the uploaded image
			const photoURL = await getDownloadURL(storageRef);

			// Update the local state to reflect the new image URL
			setEditedUser((prev) => ({ ...prev, photoURL }));

			// Update Firebase Authentication with the new photo URL
			await updateProfile(user, { photoURL });

			// Update Firestore user document with the new photo URL
			const userDocRef = doc(db, 'users', user.uid);
			await updateDoc(userDocRef, { photoURL });
		}
	};

	// Handle image delete
	const handleImageDelete = async () => {
		if (user) {
			try {
				// Delete the image from Firebase Storage if it exists
				if (editedUser.photoURL) {
					const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
					await deleteObject(storageRef);
				}

				// Set the photoURL in Firebase Authentication to an empty string
				await updateProfile(user, { photoURL: '' });

				// Set the photoURL in Firestore to an empty string as well
				const userDocRef = doc(db, 'users', user.uid);
				await updateDoc(userDocRef, { photoURL: '' });

				// Update the local state to reflect the removal of the image
				setEditedUser((prev) => ({ ...prev, photoURL: '' }));
			} catch (error) {
				console.error('Error deleting profile picture:', error);
				setError(t('profile.errorDeletingImage'));
			}
		}
	};

	// Handle form submission for profile update
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user || !userData) return;

		if (!editedUser.displayName.trim()) {
			setError(t('profile.errorDisplayNameRequired'));
			return;
		}

		try {
			// Update user profile in Firestore
			await updateProfile(user, {
				displayName: editedUser.displayName,
				photoURL: editedUser.photoURL,
			});

			const userDocRef = doc(db, 'users', user.uid);
			await updateDoc(userDocRef, {
				displayName: editedUser.displayName,
				profileMessage: editedUser.profileMessage,
				isCouple: editedUser.isCouple,
				partnerId: editedUser.partnerId,
			});

			// Update anniversary in couples collection
			if (userData.coupleId) {
				const coupleDocRef = doc(db, 'couples', userData.coupleId);
				await updateDoc(coupleDocRef, {
					anniversary: editedUser.anniversary,
				});
			}

			// 업데이트된 정보를 상태에 반영하여 즉시 리렌더링
			setUserData((prevData) => ({
				...prevData,
				displayName: editedUser.displayName,
				photoURL: editedUser.photoURL,
				profileMessage: editedUser.profileMessage,
				partnerId: editedUser.partnerId || '',
				isCouple: editedUser.isCouple,
				coupleId: prevData?.coupleId || '',
				createdAt: prevData?.createdAt || '',
				email: prevData?.email || '',
				userId: prevData?.userId || '',
			}));

			setIsEditing(false);
			setError('');
		} catch (error) {
			console.error('Error updating profile:', error);
			setError(t('profile.errorUpdatingProfile'));
		}
	};

	// Handle account deletion
	const handleDeleteAccount = async () => {
		if (confirm(t('profile.confirmDeleteAccount')) && user) {
			try {
				await deleteUser(user);
				alert(t('profile.accountDeleted'));
			} catch (error) {
				console.error('Error deleting account:', error);
				setError(t('profile.errorDeletingAccount'));
			}
		}
	};

	// 커플 해제 핸들러
	const handleCoupleUnlink = async () => {
		const confirmed = confirm(t('profile.confirmUnlinkCouple'));
		if (confirmed && user && userData?.isCouple && userData.partnerId) {
			try {
				await updateDoc(doc(db, 'users', user.uid), {
					isCouple: false,
					partnerId: '',
					coupleId: '',
				});
				await updateDoc(doc(db, 'users', userData.partnerId), {
					isCouple: false,
					partnerId: '',
					coupleId: '',
				});

				setUserData((prevData) => {
					if (!prevData) return null;
					return {
						...prevData,
						isCouple: false,
						partnerId: '',
					};
				});

				alert(t('profile.coupleUnlinked'));
				location.reload();
			} catch (err) {
				console.error('Error unlinking couple:', err);
				setError(t('profile.errorUnlinkCouple'));
			}
		}
	};

	if (!user || !userData) return;

	return (
		<UserProfilePresentation
			user={user}
			userData={userData}
			partnerName={partnerName}
			loadingPartner={loadingPartner}
			isEditing={isEditing}
			editedUser={editedUser}
			error={error}
			t={t}
			setIsEditing={setIsEditing}
			handleInputChange={handleInputChange}
			handleSubmit={handleSubmit}
			handleDeleteAccount={handleDeleteAccount}
			handleImageUpload={handleImageUpload}
			handleImageDelete={handleImageDelete}
			handleAnniversaryChange={handleAnniversaryChange}
			handleCoupleUnlink={handleCoupleUnlink}
		/>
	);
};

export default UserProfileContainer;
