export interface UserData {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: string;
  profileMessage: string;
  isCouple: boolean;
  partnerId: string | null;
}
