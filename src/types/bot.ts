export interface DiscordBot {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  invite_url: string;
  website_url?: string;
  github_url?: string;
  tags: string[];
  owner_id: string;
  owner_username: string;
  created_at: string;
  approved: boolean;
  server_count?: number;
  vote_count?: number;
}