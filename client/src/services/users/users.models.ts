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
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  company_id?: string;
  password_confirmation: string;
  phone?: string;
  profile_picture?: string;
};

export type MeResponse = {
  first_name: string;
  last_name: string;
  id: string;
  username: string;
  email: string;
  company: string;
  role: number;
  phone: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
};
