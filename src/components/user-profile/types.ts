import { User } from 'firebase/auth';
import { UserData } from '@/types/user';

export interface EditedUser {
	displayName: string;
	photoURL: string | null;
	profileMessage: string;
	isCouple: boolean;
	partnerId: string | null;
}

export interface UserProfilePresentationProps {
	user: User;
	userData: UserData;
	isEditing: boolean;
	editedUser: EditedUser;
	error: string;
	t: (key: string) => string;
	setIsEditing: (value: boolean) => void;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSubmit: (e: React.FormEvent) => void;
	handleDeleteAccount: () => void;
	handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleImageDelete?: () => void;
}

export interface ProfileImageProps {
	user: User;
	t: (key: string) => string;
}

export interface ProfileDetailsProps {
	user: User;
	userData: UserData;
	t: (key: string) => string;
}

export interface EditFormProps {
	editedUser: EditedUser;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSubmit: (e: React.FormEvent) => void;
	t: (key: string) => string;
	setIsEditing: (value: boolean) => void;
	handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleImageDelete?: () => void;
}

export interface EditFieldProps {
	editedUser: EditedUser;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	t: (key: string) => string;
}

export interface EditAccountButtonProps {
	setIsEditing: (value: boolean) => void;
	t: (key: string) => string;
}

export interface DeleteAccountButtonProps {
	handleDeleteAccount: () => void;
	t: (key: string) => string;
}
