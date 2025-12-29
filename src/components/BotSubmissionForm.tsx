"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { botService } from "@/services/botService";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { useNavigate } from "react-router-dom";

interface BotFormData {
  name: string;
  description: string;
  avatar_url: string;
  invite_url: string;
  website_url: string;
  github_url: string;
  tags: string;
}

const BotSubmissionForm = () => {
  const [formData, setFormData] = useState<BotFormData>({
    name: "",
    description: "",
    avatar_url: "",
    invite_url: "",
    website_url: "",
    github_url: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useDiscordAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with Discord to submit a bot",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await botService.submitBot({
        name: formData.name,
        description: formData.description,
        avatar_url: formData.avatar_url,
        invite_url: formData.invite_url,
        website_url: formData.website_url || undefined,
        github_url: formData.github_url || undefined,
        tags: tagsArray,
        owner_id: user.id,
        owner_username: user.username,
      });

      toast({
        title: "Bot Submitted",
        description: "Your bot has been submitted for review",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        avatar_url: "",
        invite_url: "",
        website_url: "",
        github_url: "",
        tags: "",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit bot",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Discord Bot</CardTitle>
        <CardDescription>
          Share your bot with the community. All submissions are reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Awesome Bot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what your bot does..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL *</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.png"
              required
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite_url">Invite URL *</Label>
            <Input
              id="invite_url"
              name="invite_url"
              value={formData.invite_url}
              onChange={handleChange}
              placeholder="https://discord.com/api/oauth2/authorize?client_id=..."
              required
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL (optional)</Label>
            <Input
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="https://mybotwebsite.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL (optional)</Label>
            <Input
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username/bot"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="moderation, music, utility"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Bot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BotSubmissionForm;