export interface IUser {
  username: string;
  password: string;
  role: 'agency' | 'provider';
  providerType?: 'transportist' | 'tourism';
}
