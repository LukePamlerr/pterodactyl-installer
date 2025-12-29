"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { botService } from "@/services/botService";
import { DiscordBot } from "@/types/bot";
import BotCard from "@/components/BotCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";

const BotDirectory = () => {
  const [bots, setBots] = useState<DiscordBot[]>([]);
  const [filteredBots, setFilteredBots] = useState<DiscordBot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useDiscordAuth();

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await botService.getApprovedBots();
        setBots(data);
        setFilteredBots(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch bots",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = bots.filter(bot => 
        bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBots(filtered);
    } else {
      setFilteredBots(bots);
    }
  }, [searchTerm, bots]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discord Bot Directory</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing Discord bots created by the community. Add your own bot to share it with others!
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button asChild size="lg">
              <Link to="/submit">Submit Your Bot</Link>
            </Button>
          ) : (
            <Button size="lg">
              <Link to="/submit">Submit Your Bot</Link>
            </Button>
          )}
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard">My Bots</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bots by name, description, or tags..."
            className="pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredBots.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No bots found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try a different search term" : "Be the first to submit a bot!"}
          </p>
          <Button asChild>
            <Link to="/submit">Submit Your Bot</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map(bot => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BotDirectory;