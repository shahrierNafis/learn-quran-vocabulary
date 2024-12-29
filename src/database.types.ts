export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      collections: {
        Row: {
          description: string | null
          id: number
          is_default: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          is_default?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          is_default?: boolean | null
          name?: string
        }
        Relationships: []
      }
      user_intervals: {
        Row: {
          interval_ms: number
          progress: number
          user_id: string
        }
        Insert: {
          interval_ms: number
          progress: number
          user_id?: string
        }
        Update: {
          interval_ms?: number
          progress?: number
          user_id?: string
        }
        Relationships: []
      }
      user_preference: {
        Row: {
          preference: Json | null
          user_id: string
        }
        Insert: {
          preference?: Json | null
          user_id?: string
        }
        Update: {
          preference?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          progress: number
          updated_at: string
          user_id: string
          word_group_id: number
        }
        Insert: {
          progress: number
          updated_at?: string
          user_id?: string
          word_group_id: number
        }
        Update: {
          progress?: number
          updated_at?: string
          user_id?: string
          word_group_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_user_progress_word_group_id_fkey"
            columns: ["word_group_id"]
            isOneToOne: false
            referencedRelation: "word_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      word_groups: {
        Row: {
          collection_id: number
          description: string | null
          id: number
          name: string | null
          words: string[]
        }
        Insert: {
          collection_id: number
          description?: string | null
          id?: number
          name?: string | null
          words: string[]
        }
        Update: {
          collection_id?: number
          description?: string | null
          id?: number
          name?: string | null
          words?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "public_word_groups_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_0_word_groups: {
        Args: {
          collection_id: number
        }
        Returns: {
          collection_id: number
          description: string | null
          id: number
          name: string | null
          words: string[]
        }[]
      }
      get_word_groups: {
        Args: {
          collection_id: number
        }
        Returns: {
          collection_id: number
          description: string | null
          id: number
          name: string | null
          words: string[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

