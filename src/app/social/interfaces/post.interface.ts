export interface Post {
  _id: string;
  title: string;
  content: string;
  likes: number;
  updatedAt: string;
  createdAt: string;
  deletedAt: null;
  isActive: boolean;
  userId: UserID;
  __v: number;
}

export interface UserID {
  _id: string;
  fullName: string;
  idImageRandom: number;
}

export interface CreatePost {
  userId: string;
  title: string;
  content: string;
}

export interface UpdatePost {
  title: string;
  content: string;
}
