import { UserData } from '@/types/user';

export interface CoupleRequestPresentationProps {
	inviter: UserData | null;
	error: string;
	loading: boolean;
	onAcceptInvitation: () => void;
	t: (key: string) => string;
}
