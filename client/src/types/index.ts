// Common types for the application
export interface Contact {
  id: string;
  first_name: string;
  last_name?: string;
  nickname?: string;
  email?: string;
  phone_number?: string;
  relationship_type?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  due_date?: string;
  start_date?: string;
  duration_minutes?: number;
  project_id?: string;
  related_contact_id?: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  progress_percentage?: number;
  category?: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  transaction_date: string;
  user_id: string;
  created_at: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  status: string;
  user_id: string;
  created_at: string;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  category: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  category?: string;
  current_value?: number;
  user_id: string;
  created_at: string;
}