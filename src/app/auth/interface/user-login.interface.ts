export interface UserLogin {
  user: User;
  token: string;
}

export interface User {
  _id: string;
  fullName: string;
  birthDate: string;
  email: string;
  posts: any[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  deletedAt: null;
  __v: number;
}
