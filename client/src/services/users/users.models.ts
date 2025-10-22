export type ListusersResponse = {
  id: string;
  username: string;
  email: string;
  company: string;
  role: number;
  phone: string | null;
  profile_picture: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
};

export type MeResponse = {
  id: string;
  username: string;
  email: string;
  company: null | string;
  role: number;
  phone: string | null;
  profile_picture: null | string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
};
