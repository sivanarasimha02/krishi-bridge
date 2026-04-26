export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      listings: {
        Row: {
          category: Database["public"]["Enums"]["produce_category"]
          created_at: string
          description: string | null
          farmer_id: string
          harvest_date: string | null
          id: string
          images: string[]
          is_active: boolean
          is_verified: boolean
          name: string
          pincode: string
          price_per_kg: number
          stock_kg: number
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["produce_category"]
          created_at?: string
          description?: string | null
          farmer_id: string
          harvest_date?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_verified?: boolean
          name: string
          pincode: string
          price_per_kg: number
          stock_kg: number
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["produce_category"]
          created_at?: string
          description?: string | null
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_verified?: boolean
          name?: string
          pincode?: string
          price_per_kg?: number
          stock_kg?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          consumer_id: string
          consumer_name: string
          consumer_phone: string
          consumer_pincode: string
          created_at: string
          farmer_id: string
          id: string
          listing_id: string
          notes: string | null
          price_per_kg: number
          product_image: string | null
          product_name: string
          quantity_kg: number
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          consumer_id: string
          consumer_name: string
          consumer_phone: string
          consumer_pincode: string
          created_at?: string
          farmer_id: string
          id?: string
          listing_id: string
          notes?: string | null
          price_per_kg: number
          product_image?: string | null
          product_name: string
          quantity_kg: number
          status?: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          consumer_id?: string
          consumer_name?: string
          consumer_phone?: string
          consumer_pincode?: string
          created_at?: string
          farmer_id?: string
          id?: string
          listing_id?: string
          notes?: string | null
          price_per_kg?: number
          product_image?: string | null
          product_name?: string
          quantity_kg?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          farm_name: string | null
          full_name: string | null
          id: string
          is_verified: boolean
          phone: string | null
          pincode: string | null
          primary_crop: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean
          phone?: string | null
          pincode?: string | null
          primary_crop?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean
          phone?: string | null
          pincode?: string | null
          primary_crop?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "farmer" | "consumer"
      order_status:
        | "pending"
        | "confirmed"
        | "packed"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      produce_category: "vegetables" | "fruits" | "grains" | "dairy" | "other"
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
    Enums: {
      app_role: ["admin", "farmer", "consumer"],
      order_status: [
        "pending",
        "confirmed",
        "packed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      produce_category: ["vegetables", "fruits", "grains", "dairy", "other"],
    },
  },
} as const
