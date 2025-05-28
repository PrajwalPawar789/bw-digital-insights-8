export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          date: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documentation: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          order_index: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leadership_profiles: {
        Row: {
          bio: string
          company: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          slug: string
          title: string
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio: string
          company?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          slug: string
          title: string
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string
          company?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          slug?: string
          title?: string
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      magazines: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          issue_number: number | null
          pdf_url: string | null
          publish_date: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          issue_number?: number | null
          pdf_url?: string | null
          publish_date: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          issue_number?: number | null
          pdf_url?: string | null
          publish_date?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          author: string
          content: string
          created_at: string | null
          date: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
