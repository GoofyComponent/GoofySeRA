export interface Tickets {
  pages?: (TicketsEntity[] | null)[] | null;
  pageParams?: null[] | null;
}
export interface TicketsEntity {
  id: number;
  user_id: number;
  user: {
    lastname: string;
  };
  priority: string;
  title: string;
  description: string;
  needs: string;
  status: string;
  deleted_at?: null;
  created_at: string;
  updated_at: string;
}

export interface Users {
  pages?: (UsersEntity[] | null)[] | null;
  pageParams?: null[] | null;
}
export interface UsersEntity {
  id: number;
  avatar_filename?: string;
  avatar_url?: string;
  firstname: string;
  lastname: string;
  email: string;
  email_verified_at?: null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface MyError {
  message: string;
  errors: {
    [key: string]: string[];
  };
}
