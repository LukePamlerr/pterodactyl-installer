"use client";

import { Button } from "@/components/ui/button";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { LogOut, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { user, signInWithDiscord, signOut, loading } = useDiscordAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold">Discord Bot Directory</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                Directory
              </Link>
              {user && (
                <Link to="/submit" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                  Submit Bot
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img 
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  )}
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={signInWithDiscord}>
                Sign in with Discord
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;