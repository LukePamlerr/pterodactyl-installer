"use client";

import { useState, useEffect } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { botService } from "@/services/botService";
import { DiscordBot } from "@/types/bot";
import { useToast } from "@/hooks/use-toast";
import BotCard from "@/components/BotCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Bot } from "lucide-react";

const Dashboard = () => {
  const { user, signInWithDiscord } = useDiscordAuth();
  const [bots, setBots] = useState<DiscordBot[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserBots();
    }
  }, [user]);

  const fetchUserBots = async () => {
    try {
      const data = await botService.getUserBots(user!.id);
      setBots(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch your bots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Sign in with Discord to manage your bots
        </p>
        <Button onClick={signInWithDiscord} size="lg">
          Sign in with Discord
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your submitted bots
          </p>
        </div>
        <Button asChild>
          <Link to="/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submit New Bot
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : bots.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Bot className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No bots submitted yet</h2>
          <p className="text-muted-foreground mb-6">
            Submit your first Discord bot to get started
          </p>
          <Button asChild>
            <Link to="/submit">Submit Your First Bot</Link>
          </Button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Submitted Bots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map(bot => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;