export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      asset_maintenance_log: {
        Row: {
          asset_id: string
          cost: number | null
          description: string
          id: string
          maintenance_date: string
          next_due_date: string | null
        }
        Insert: {
          asset_id: string
          cost?: number | null
          description: string
          id?: string
          maintenance_date: string
          next_due_date?: string | null
        }
        Update: {
          asset_id?: string
          cost?: number | null
          description?: string
          id?: string
          maintenance_date?: string
          next_due_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_maintenance_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          category: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          image_url: string | null
          insurance_expiry_date: string | null
          license_expiry_date: string | null
          location: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string | null
          updated_at: string | null
          user_id: string
          warranty_end_date: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          insurance_expiry_date?: string | null
          license_expiry_date?: string | null
          location?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          updated_at?: string | null
          user_id: string
          warranty_end_date?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          insurance_expiry_date?: string | null
          license_expiry_date?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          updated_at?: string | null
          user_id?: string
          warranty_end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          due_date: string
          id: string
          is_recurring: boolean | null
          name: string
          notes: string | null
          paid_at: string | null
          recurring_pattern: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          due_date: string
          id?: string
          is_recurring?: boolean | null
          name: string
          notes?: string | null
          paid_at?: string | null
          recurring_pattern?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          due_date?: string
          id?: string
          is_recurring?: boolean | null
          name?: string
          notes?: string | null
          paid_at?: string | null
          recurring_pattern?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          category: string
          created_at: string | null
          current_amount: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          monthly_limit: number | null
          name: string
          start_date: string
          target_amount: number | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          current_amount?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_limit?: number | null
          name: string
          start_date: string
          target_amount?: number | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          current_amount?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_limit?: number | null
          name?: string
          start_date?: string
          target_amount?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_memory: {
        Row: {
          action_identified: string | null
          ai_response: string | null
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          updated_at: string | null
          user_id: string
          user_message: string
        }
        Insert: {
          action_identified?: string | null
          ai_response?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
          user_message: string
        }
        Update: {
          action_identified?: string | null
          ai_response?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
          user_message?: string
        }
        Relationships: []
      }
      contact_interactions: {
        Row: {
          contact_id: string
          id: string
          interaction_date: string | null
          interaction_type: string
          notes: string | null
          sentiment: string | null
          user_id: string
        }
        Insert: {
          contact_id: string
          id?: string
          interaction_date?: string | null
          interaction_type: string
          notes?: string | null
          sentiment?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string
          id?: string
          interaction_date?: string | null
          interaction_type?: string
          notes?: string | null
          sentiment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          birthdate: string | null
          contact_frequency_days: number | null
          created_at: string | null
          dislikes: string | null
          email: string | null
          first_name: string
          id: string
          last_contacted_at: string | null
          last_name: string | null
          likes: string | null
          next_contact_due: string | null
          nickname: string | null
          notes: string | null
          phone_number: string | null
          profile_picture_url: string | null
          relationship_level: string | null
          relationship_type: string | null
          social_media_handles: Json | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birthdate?: string | null
          contact_frequency_days?: number | null
          created_at?: string | null
          dislikes?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_contacted_at?: string | null
          last_name?: string | null
          likes?: string | null
          next_contact_due?: string | null
          nickname?: string | null
          notes?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          relationship_level?: string | null
          relationship_type?: string | null
          social_media_handles?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birthdate?: string | null
          contact_frequency_days?: number | null
          created_at?: string | null
          dislikes?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_contacted_at?: string | null
          last_name?: string | null
          likes?: string | null
          next_contact_due?: string | null
          nickname?: string | null
          notes?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          relationship_level?: string | null
          relationship_type?: string | null
          social_media_handles?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          id: string
          mood: string
          notes: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          id?: string
          mood: string
          notes?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          id?: string
          mood?: string
          notes?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          format: string | null
          id: string
          is_private: boolean | null
          linked_contact_id: string | null
          linked_project_id: string | null
          linked_task_id: string | null
          source_page: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          format?: string | null
          id?: string
          is_private?: boolean | null
          linked_contact_id?: string | null
          linked_project_id?: string | null
          linked_task_id?: string | null
          source_page?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          format?: string | null
          id?: string
          is_private?: boolean | null
          linked_contact_id?: string | null
          linked_project_id?: string | null
          linked_task_id?: string | null
          source_page?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_linked_contact_id_fkey"
            columns: ["linked_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_linked_project_id_fkey"
            columns: ["linked_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_linked_task_id_fkey"
            columns: ["linked_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          delivery_method: string | null
          id: string
          is_read: boolean | null
          message: string
          sent_at: string | null
          target_url: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sent_at?: string | null
          target_url?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          sent_at?: string | null
          target_url?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          document_name: string
          file_type: string | null
          file_url: string
          id: string
          linked_external_id: string | null
          project_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_name: string
          file_type?: string | null
          file_url: string
          id?: string
          linked_external_id?: string | null
          project_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          linked_external_id?: string | null
          project_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_cost: number | null
          category: string | null
          created_at: string | null
          deadline: string | null
          estimated_budget: number | null
          id: string
          is_private: boolean | null
          is_template: boolean | null
          last_activity_at: string | null
          long_description: string | null
          name: string
          objective: string | null
          progress_percentage: number | null
          short_description: string | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          estimated_budget?: number | null
          id?: string
          is_private?: boolean | null
          is_template?: boolean | null
          last_activity_at?: string | null
          long_description?: string | null
          name: string
          objective?: string | null
          progress_percentage?: number | null
          short_description?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          estimated_budget?: number | null
          id?: string
          is_private?: boolean | null
          is_template?: boolean | null
          last_activity_at?: string | null
          long_description?: string | null
          name?: string
          objective?: string | null
          progress_percentage?: number | null
          short_description?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          ai_insights: Json | null
          content_summary: string
          file_url: string | null
          generated_at: string | null
          id: string
          is_read: boolean | null
          period_end: string
          period_start: string
          report_type: string
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          content_summary: string
          file_url?: string | null
          generated_at?: string | null
          id?: string
          is_read?: boolean | null
          period_end: string
          period_start: string
          report_type: string
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          content_summary?: string
          file_url?: string | null
          generated_at?: string | null
          id?: string
          is_read?: boolean | null
          period_end?: string
          period_start?: string
          report_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_logs: {
        Row: {
          completion_time: string | null
          id: string
          is_completed: boolean | null
          notes: string | null
          routine_id: string
          user_id: string
        }
        Insert: {
          completion_time?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          routine_id: string
          user_id: string
        }
        Update: {
          completion_time?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          routine_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_logs_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_duration_minutes: number | null
          frequency_pattern: Json | null
          id: string
          is_active: boolean | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          frequency_pattern?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          frequency_pattern?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          ai_suggested: boolean | null
          category: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          duration_minutes: number | null
          id: string
          is_recurring: boolean | null
          parent_task_id: string | null
          priority: string | null
          project_id: string | null
          recurring_pattern: Json | null
          related_asset_id: string | null
          related_contact_id: string | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          ai_suggested?: boolean | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          is_recurring?: boolean | null
          parent_task_id?: string | null
          priority?: string | null
          project_id?: string | null
          recurring_pattern?: Json | null
          related_asset_id?: string | null
          related_contact_id?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          ai_suggested?: boolean | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          is_recurring?: boolean | null
          parent_task_id?: string | null
          priority?: string | null
          project_id?: string | null
          recurring_pattern?: Json | null
          related_asset_id?: string | null
          related_contact_id?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_related_asset_id_fkey"
            columns: ["related_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_related_contact_id_fkey"
            columns: ["related_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          currency: string
          description: string | null
          id: string
          is_recurring: boolean | null
          linked_asset_id: string | null
          linked_bill_id: string | null
          payment_method: string | null
          recurring_pattern: Json | null
          transaction_date: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          linked_asset_id?: string | null
          linked_bill_id?: string | null
          payment_method?: string | null
          recurring_pattern?: Json | null
          transaction_date?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          linked_asset_id?: string | null
          linked_bill_id?: string | null
          payment_method?: string | null
          recurring_pattern?: Json | null
          transaction_date?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_linked_asset_id_fkey"
            columns: ["linked_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_linked_bill_id_fkey"
            columns: ["linked_bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mini_memories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          memory_text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          memory_text: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          memory_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mini_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          currency: string | null
          default_view: string | null
          mood_checkin_frequency: string | null
          notification_preferences: Json | null
          report_frequency: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          currency?: string | null
          default_view?: string | null
          mood_checkin_frequency?: string | null
          notification_preferences?: Json | null
          report_frequency?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          currency?: string | null
          default_view?: string | null
          mood_checkin_frequency?: string | null
          notification_preferences?: Json | null
          report_frequency?: string | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_active_at: string | null
          last_name: string | null
          locale: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_active_at?: string | null
          last_name?: string | null
          locale?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_active_at?: string | null
          last_name?: string | null
          locale?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_raw_sql: {
        Args: { sql_query: string; params: Json }
        Returns: Json
      }
      execute_sql_query: {
        Args: { query_text: string }
        Returns: Json
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
          filter_user_id: string
        }
        Returns: {
          id: string
          original_text: string
          context_type: string
          metadata: Json
          created_at: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
