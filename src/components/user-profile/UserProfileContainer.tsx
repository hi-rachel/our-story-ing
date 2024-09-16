import { useState, useEffect } from 'react';
import { auth, db, storage } from '../../../firebase';
import { User, deleteUser, updateProfile } from 'firebase/auth';
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import UserProfilePresentation from './UserProfilePresentation';
import { useTranslation } from 'next-i18next';
import { EditedUser } from './types';
import { UserData } from '@/types/user';

export default function UserProfileContainer() {
	const user = auth.currentUser as User | null;
	const [isEditing, setIsEditing] = useState(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [editedUser, setEditedUser] = useState<EditedUser>({
		displayName: user?.displayName || 'Anonymous',
		photoURL: user?.photoURL || null,
		profileMessage: '',
		isCouple: false,
		partnerId: null,
	});
	const [error, setError] = useState('');
	const { t } = useTranslation();

	// Fetch user data from Firestore
	useEffect(() => {
		if (user) {
			const fetchUserData = async () => {
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					const data = userDoc.data() as UserData;
					setUserData(data);
					setEditedUser({
						displayName: user.displayName || 'Anonymous',
						photoURL: user.photoURL || null,
						profileMessage: data.profileMessage || '',
						isCouple: data.isCouple || false,
						partnerId: data.partnerId || null,
					});
				}
			};
			fetchUserData();
		}
	}, [user]);

	// Handle input change for editing profile
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
	};

	// Handle image upload
	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file && user) {
			const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

			if (file.size > MAX_FILE_SIZE) {
				setError(t('profile.errorFileSizeExceeded')); // Show an error if the file size exceeds the limit
				return;
			}

			const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

			// Upload the image to Firebase Storage
			await uploadBytes(storageRef, file);

			// Get the download URL for the uploaded image
			const photoURL = await getDownloadURL(storageRef);

			// Update the local state to reflect the new image URL
			setEditedUser((prev) => ({ ...prev, photoURL })); // <== This ensures the image preview updates

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
					const storageRef = ref(
						storage,
						`users/${user.uid}/profile.jpg`
					);
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
			await updateProfile(user, {
				displayName: editedUser.displayName,
				photoURL: editedUser.photoURL,
			});

			const userDocRef = doc(db, 'users', user.uid);
			await updateDoc(userDocRef, {
				profileMessage: editedUser.profileMessage,
				isCouple: editedUser.isCouple,
				partnerId: editedUser.partnerId,
			});

			// Update only the editable fields in the state
			setUserData((prevUserData) => {
				if (!prevUserData) return null; // Ensure userData is not null
				return {
					...prevUserData, // Spread the previous data to preserve userId, email, createdAt
					displayName: editedUser.displayName,
					photoURL: editedUser.photoURL,
					profileMessage: editedUser.profileMessage,
					isCouple: editedUser.isCouple,
					partnerId: editedUser.partnerId,
				};
			});

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

	// Pass data to presentation component
	if (!user || !userData) return null;

	return (
		<UserProfilePresentation
			user={user}
			userData={userData}
			isEditing={isEditing}
			editedUser={editedUser}
			error={error}
			t={t}
			setIsEditing={setIsEditing}
			handleInputChange={handleInputChange}
			handleSubmit={handleSubmit}
			handleImageUpload={handleImageUpload}
			handleImageDelete={handleImageDelete}
			handleDeleteAccount={handleDeleteAccount}
		/>
	);
}
