import { User } from 'firebase/auth';
import { UserData } from '@/types/user';

export interface EditedUser {
	displayName: string;
	email: string;
	photoURL: string | null;
	profileMessage: string;
	isCouple: boolean;
	partnerId: string | null;
	anniversary: string;
}

export interface UserProfilePresentationProps {
	user: User;
	userData: UserData;
	partnerName: string | null;
	loadingPartner: boolean;
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
	handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleImageDelete: () => void;
	handleCoupleUnlink: () => void;
	handleAnniversaryChange: (date: Date | null) => void;
}

export interface ProfileImageProps {
	user: User;
	t: (key: string) => string;
}

export interface ProfileDetailsProps {
	partnerName: string | null;
	loadingPartner: boolean;
	user: User;
	userData: UserData;
	t: (key: string) => string;
}

export interface EditFormProps {
	partnerName: string | null;
	loadingPartner: boolean;
	editedUser: EditedUser;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSubmit: (e: React.FormEvent) => void;
	t: (key: string) => string;
	setIsEditing: (value: boolean) => void;
	handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleImageDelete?: () => void;
	handleAnniversaryChange: (date: Date | null) => void;
	handleCoupleUnlink: () => void;
	handleDeleteAccount: () => void;
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
