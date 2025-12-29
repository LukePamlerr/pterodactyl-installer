"use client";

import BotSubmissionForm from "@/components/BotSubmissionForm";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SubmitBot = () => {
  const { user, signInWithDiscord } = useDiscordAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Your Discord Bot</h1>
          <p className="text-muted-foreground">
            Share your creation with the Discord community
          </p>
        </div>

        {!user ? (
          <div className="bg-card border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign in to Submit</h2>
            <p className="text-muted-foreground mb-6">
              You need to sign in with Discord to submit your bot. This helps us verify ownership and contact you if needed.
            </p>
            <Button onClick={signInWithDiscord} size="lg">
              Sign in with Discord
            </Button>
          </div>
        ) : (
          <BotSubmissionForm />
        )}
      </div>
    </div>
  );
};

export default SubmitBot;