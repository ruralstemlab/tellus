export interface Institution {
  id: string;
  name: string;
  municipality: string;
  department: string;
  country: string;
  active: boolean;
  logoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}