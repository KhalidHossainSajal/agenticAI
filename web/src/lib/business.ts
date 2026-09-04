export interface PublicBusiness {
  id: number;
  name: string;
  slug: string;
  createdBy: number;
  createdAt: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Member {
  id: number;
  userId: number;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: string;
}
