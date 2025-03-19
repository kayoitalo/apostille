export type UserRole = 'CLIENT' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
}