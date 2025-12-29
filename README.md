# Discord Bot Directory

A platform for submitting and discovering Discord bots with Discord authentication.

## Features

- Discord OAuth authentication
- Submit your Discord bots
- Browse and search bots
- User dashboard to manage your submissions
- Responsive design

## Setup

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Set up Discord OAuth in your Supabase project:
   - Go to Authentication > Providers > Discord
   - Configure with your Discord application credentials
3. Create a table for bots in Supabase:
   ```sql
   create table bots (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default now(),
     name text not null,
     description text not null,
     avatar_url text,
     invite_url text not null,
     website_url text,
     github_url text,
     tags text[] default '{}',
     owner_id text not null,
     owner_username text not null,
     approved boolean default false,
     server_count integer,
     vote_count integer default 0
   );
   
   -- Enable Row Level Security
   alter table bots enable row level security;
   
   -- Create policies
   create policy "Bots are viewable by everyone" on bots
     for select using (approved = true);
     
   create policy "Users can insert their own bots" on bots
     for insert with check (auth.uid() = owner_id);
     
   create policy "Users can update their own bots" on bots
     for update using (auth.uid() = owner_id);
     
   create policy "Users can delete their own bots" on bots
     for delete using (auth.uid() = owner_id);
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This app can be deployed to any platform that supports Vite applications, such as Vercel, Netlify, or similar services.