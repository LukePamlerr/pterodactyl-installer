"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  access_token: string;
}

interface DiscordAuthContextType {
  user: DiscordUser | null;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const DiscordAuthContext = createContext<DiscordAuthContextType | undefined>(undefined);

export const DiscordAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize Supabase client
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get Discord user data from user metadata
          const discordData = session.user.user_metadata?.discord;
          if (discordData) {
            setUser({
              id: session.user.id,
              username: discordData.username,
              discriminator: discordData.discriminator,
              avatar: discordData.avatar_url,
              access_token: session.provider_token || ''
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const discordData = session.user.user_metadata?.discord;
        if (discordData) {
          setUser({
            id: session.user.id,
            username: discordData.username,
            discriminator: discordData.discriminator,
            avatar: discordData.avatar_url,
            access_token: session.provider_token || ''
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithDiscord = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'identify guilds'
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Discord",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <DiscordAuthContext.Provider value={{ user, signInWithDiscord, signOut, loading }}>
      {children}
    </DiscordAuthContext.Provider>
  );
};

export const useDiscordAuth = () => {
  const context = useContext(DiscordAuthContext);
  if (context === undefined) {
    throw new Error('useDiscordAuth must be used within a DiscordAuthProvider');
  }
  return context;
};