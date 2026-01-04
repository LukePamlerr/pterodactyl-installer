# Discord Bot Directory

A comprehensive Discord bot directory platform built with Next.js, TypeScript, and Tailwind CSS. Users can discover, submit, and review Discord bots with real-time validation and Discord API integration.

## Features

- 🔐 **Discord OAuth Authentication** - Secure login with Discord accounts
- 🤖 **Bot Submission** - Submit Discord bots with real-time validation
- ⭐ **Review System** - Rate and review bots with star ratings
- 🔍 **Advanced Search & Filtering** - Find bots by tags, name, and popularity
- 📊 **Live Status Monitoring** - Real-time system status and performance metrics
- 🌐 **Discord Webhook Integration** - Automated notifications to Discord server
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🛡️ **Robust Validation** - Comprehensive input validation and error handling
- 📈 **User Dashboard** - Manage submitted bots and track performance

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Discord provider
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Discord Developer Application
- Discord Bot Token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd discord-bot-directory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bot_directory"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-min-32-characters"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Discord Bot
DISCORD_BOT_TOKEN="your-discord-bot-token"

# Discord Webhook
DISCORD_WEBHOOK_URL="your-discord-webhook-url"
```

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Discord Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Add a bot to the application
4. Enable the **Server Members Intent** and **Bot Intent**
5. Copy the **Application ID**, **Client Secret**, and **Bot Token**

### 2. Configure OAuth2

1. In your Discord application, go to "OAuth2" → "URL Generator"
2. Select the scopes: `identify`, `email`, `guilds`
3. Copy the Client ID and Client Secret to your environment variables

### 3. Set Up Webhook

1. Create a Discord server for notifications
2. Create a webhook channel
3. Copy the webhook URL to your environment variables

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── bots/              # Bot listing and details
│   ├── dashboard/         # User dashboard
│   ├── submit/            # Bot submission
│   └── status/            # System status
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── discord.ts       # Discord API integration
│   ├── prisma.ts        # Prisma client
│   ├── validation.ts    # Input validation
│   ├── errors.ts        # Error handling
│   └── webhook.ts       # Discord webhook
└── types/                # TypeScript type definitions
```

## API Endpoints

### Bots
- `GET /api/bots` - List all approved bots
- `POST /api/bots` - Submit a new bot
- `GET /api/bots/[id]` - Get bot details
- `POST /api/bots/[id]/reviews` - Add a review

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### User
- `GET /api/user/bots` - Get user's submitted bots

### System
- `GET /api/status` - System status and metrics
- `POST /api/validate-bot` - Validate Discord application

## Database Schema

The application uses Prisma with the following main models:

- **User** - Discord user accounts
- **Bot** - Discord bot submissions
- **Review** - Bot reviews and ratings
- **Account/Session** - NextAuth.js authentication

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Make sure to set these in your production environment:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Random secret string
- `DISCORD_CLIENT_ID` - Discord application client ID
- `DISCORD_CLIENT_SECRET` - Discord application client secret
- `DISCORD_BOT_TOKEN` - Discord bot token
- `DISCORD_WEBHOOK_URL` - Discord webhook URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/discord-bot-directory/issues) page
2. Create a new issue with detailed information
3. Join our Discord server for community support
