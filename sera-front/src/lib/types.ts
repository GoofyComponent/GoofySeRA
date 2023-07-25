export interface Tickets {
  pages?: (TicketsEntity[] | null)[] | null;
  pageParams?: null[] | null;
}
export interface TicketsEntity {
  id: number;
  user_id: number;
  priority: string;
  title: string;
  description: string;
  needs: string;
  status: string;
  deleted_at?: null;
  created_at: string;
  updated_at: string;
}
