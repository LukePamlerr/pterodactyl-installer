import { createClient } from '@supabase/supabase-js';
import { DiscordBot } from '@/types/bot';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const botService = {
  // Submit a new bot
  async submitBot(botData: Omit<DiscordBot, 'id' | 'created_at' | 'approved' | 'vote_count'>) {
    const { data, error } = await supabase
      .from('bots')
      .insert([{ ...botData, approved: false }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all approved bots
  async getApprovedBots() {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as DiscordBot[];
  },

  // Get bots by owner
  async getUserBots(ownerId: string) {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as DiscordBot[];
  },

  // Get a single bot by ID
  async getBotById(id: string) {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as DiscordBot;
  },

  // Update bot
  async updateBot(id: string, updates: Partial<DiscordBot>) {
    const { data, error } = await supabase
      .from('bots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete bot
  async deleteBot(id: string) {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};