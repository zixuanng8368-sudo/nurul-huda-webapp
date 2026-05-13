import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";

export interface SessionData {
  user: User | null;
  session: Session | null;
}

export const useSession = () => {
  const [data, setData] = useState<SessionData>({
    user: null,
    session: null,
  });
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!error && session) {
        setData({
          user: session.user,
          session,
        });
      }
      setIsPending(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setData({
        user: session?.user ?? null,
        session: session ?? null,
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { data, isPending };
};

export const authClient = {
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  useSession,

  // Helper function to get user roles from user metadata
  getUserRole: (user: User | null): string | null => {
    if (!user) return null;
    return user.user_metadata?.role ?? null;
  },

  // Helper function to check user permissions
  hasPermission: async (userId: string, resource: string, action: string) => {
    try {
      const { data, error } = await supabase
        .from("user_permissions")
        .select("*")
        .eq("user_id", userId)
        .eq("resource", resource)
        .eq("action", action)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      return !!data;
    } catch (error) {
      console.error("Permission check failed:", error);
      return false;
    }
  },
};

export const { signOut, useSession: useSessionHook } = authClient;