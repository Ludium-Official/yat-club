export interface UserType {
  auth: "USER" | "ADMIN";
  created_at: string;
  email: string;
  id: number;
  provider: string;
  updated_at: string;
  userId: string;
  walletId: string;
  yatPoint: number;
}
