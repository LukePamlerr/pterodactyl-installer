import { DiscordBot } from "@/types/bot";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, ThumbsUp } from "lucide-react";

interface BotCardProps {
  bot: DiscordBot;
}

const BotCard = ({ bot }: BotCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        {bot.avatar_url ? (
          <img 
            src={bot.avatar_url} 
            alt={bot.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        )}
        <div>
          <CardTitle className="text-xl">{bot.name}</CardTitle>
          <CardDescription>by {bot.owner_username}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{bot.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {bot.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {bot.server_count && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{bot.server_count.toLocaleString()}</span>
            </div>
          )}
          {bot.vote_count !== undefined && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{bot.vote_count.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <Button asChild size="sm">
          <a href={bot.invite_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Invite
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BotCard;