import { Trophy, Medal, Award, Star, Share2, User } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface User {
  id: number;
  name: string;
  score: number;
  rank: number;
}

export const Leaderboard = () => {
  const [users] = useState<User[]>([
    { id: 1, name: "Alex Thompson", score: 2500, rank: 1 },
    { id: 2, name: "Maria Garcia", score: 2350, rank: 2 },
    { id: 3, name: "John Smith", score: 2200, rank: 3 },
    { id: 4, name: "Sarah Wilson", score: 2100, rank: 4 },
    { id: 5, name: "David Lee", score: 2000, rank: 5 },
  ]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user_profile") || "{}");
    } catch {
      return {};
    }
  });
  const [editProfile, setEditProfile] = useState(profile);

  const handleProfileSave = () => {
    setProfile(editProfile);
    localStorage.setItem("user_profile", JSON.stringify(editProfile));
    setProfileOpen(false);
  };

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent("Check out this awesome learning platform!");
  const shareLinks = [
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Meta (Facebook)",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-glow" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-md mx-auto glass-container animate-fade-in">
      <CardHeader className="bg-primary rounded-t-xl shadow-md">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-white drop-shadow-glow" />
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        </div>
        <p className="text-primary-foreground text-sm mt-1 opacity-80">Top performers this week</p>
      </CardHeader>
      <CardContent className="divide-y divide-border bg-background/70">
        {users.map((user) => (
          <div
            key={user.id}
            className="py-4 flex items-center justify-between hover:bg-accent/40 transition-colors cursor-pointer rounded-lg px-2"
            title={`${user.name} has earned ${user.score} points`}
            style={{backdropFilter: user.rank === 1 ? 'blur(2px) saturate(120%)' : undefined}}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-8 text-center font-semibold ${user.rank <= 3 ? "animate-bounce" : ""}`}>
                {getRankIcon(user.rank) || `#${user.rank}`}
              </div>
              <div>
                <p className="font-medium text-foreground text-lg flex items-center gap-1">
                  {user.name}
                  {user.rank === 1 && <span className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-xs text-yellow-900 font-bold shadow">Apple 🏆</span>}
                </p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm text-muted-foreground">{user.score} points</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-background/80 border-t border-border rounded-b-xl flex flex-col items-center">
        <p className="text-sm text-muted-foreground text-center mb-2">
          Keep learning to climb the leaderboard!
        </p>
        <div className="flex gap-2">
          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <button className="glass-btn-strong rounded-full px-4 py-2 text-sm shadow-md flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share this app</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                {shareLinks.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">Share on {link.name}</Button>
                  </a>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
            <DialogTrigger asChild>
              <button className="glass-btn-strong rounded-full px-4 py-2 text-sm shadow-md flex items-center gap-2">
                <User className="w-4 h-4" /> View Profile
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile Details</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <Input
                  placeholder="Name"
                  value={editProfile.name || ""}
                  onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editProfile.email || ""}
                  onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                />
                <Input
                  placeholder="Bio"
                  value={editProfile.bio || ""}
                  onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                />
                <Button onClick={handleProfileSave}>Save</Button>
              </div>
              {profile.name && (
                <div className="mt-4 p-3 rounded bg-background/60">
                  <div className="font-semibold">Name: {profile.name}</div>
                  <div className="text-sm">Email: {profile.email}</div>
                  <div className="text-sm">Bio: {profile.bio}</div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};
