import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, CalendarClock, Mail, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=64&h=64&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=64&h=64&fit=crop&auto=format",
];

const LEARNING_GOALS = [
  "Get a job in tech",
  "Prepare for an interview",
  "Improve current skills",
  "Change career paths",
  "Launch a project/startup",
  "Academic research",
  "Personal interest"
];

function Navbar() {
  return (
    <nav className="w-full bg-background/80 backdrop-blur border-b border-border/30 shadow-sm fixed top-0 left-0 z-50 font-prism">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={AVATARS[0]} alt="Logo" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="font-extrabold text-2xl tracking-tight text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-prism">Study Synergy Loop</span>
        </div>
        <div className="flex gap-6 items-center text-lg font-semibold font-prism">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="/learning-dashboard" className="hover:text-primary transition-colors">Dashboard</a>
          <a href="/profile" className="text-primary font-bold">Profile</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function PrismBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-prism">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f5d0fe] animate-gradient-move" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#a5b4fc]/40 rounded-full blur-3xl animate-bubble-move" />
      <div className="absolute top-2/3 left-2/4 w-72 h-72 bg-[#fbcfe8]/40 rounded-full blur-2xl animate-bubble-move2" />
      <div className="absolute top-1/2 left-2/5 w-60 h-60 bg-[#99f6e4]/40 rounded-full blur-2xl animate-bubble-move3" />
    </div>
  );
}

export function UserProfile() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useLocalStorage("user_profile", {
    name: user?.name || "",
    bio: "",
    avatar: AVATARS[0],
    goal: LEARNING_GOALS[0],
    notifications: {
      email: true,
      push: true,
      calendar: false
    },
    visibility: "public",
    weeklyTarget: 5,
  });

  const handleSave = () => {
    setEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    if (updateUserProfile) {
      updateUserProfile(profile);
    }
  };

  const toggleNotification = (type: string) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [type]: !profile.notifications[type as keyof typeof profile.notifications]
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <PrismBackground />
      <Navbar />
      <div className="flex flex-1 items-center justify-center pt-32 pb-16">
        <Card className="w-full max-w-2xl mx-auto glass-container p-0 shadow-2xl border-none bg-white/80 backdrop-blur-xl animate-fade-in-up rounded-3xl transition-all duration-700">
          <CardHeader className="flex flex-col items-center gap-2 bg-white/70 rounded-t-3xl pt-12 pb-8 animate-fade-in">
            <Avatar className="h-32 w-32 mb-2 ring-4 ring-primary/30 shadow-lg transition-transform duration-500 hover:scale-110">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-4xl font-extrabold text-center text-primary drop-shadow-md animate-fade-in-up delay-100 font-prism">
              {profile.name || user?.name || "User"}
            </CardTitle>
            <CardDescription className="text-center text-lg text-muted-foreground animate-fade-in-up delay-200 font-prism">
              Member since {new Date().toLocaleDateString()}
            </CardDescription>
            <Button size="sm" variant="outline" className="absolute right-8 top-8 animate-fade-in-up delay-300 font-prism" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-10 px-14 py-10 animate-fade-in-up delay-200 font-prism text-lg">
            {editing ? (
              <form className="space-y-6">
                <div className="flex flex-col gap-2 items-center">
                  <Label htmlFor="avatar">Avatar</Label>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {AVATARS.map((avatar, i) => (
                      <Avatar 
                        key={i}
                        className={`cursor-pointer transition-all ring-2 ${profile.avatar === avatar ? 'ring-primary' : 'ring-transparent'} h-14 w-14 hover:scale-110`}
                        onClick={() => setProfile({...profile, avatar})}
                      >
                        <AvatarImage src={avatar} alt={`Avatar option ${i+1}`} />
                        <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="rounded-xl bg-white/60 border-primary/20 focus:ring-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Learning Goal</Label>
                    <Select value={profile.goal} onValueChange={value => setProfile({...profile, goal: value})}>
                      <SelectTrigger className="rounded-xl bg-white/60 border-primary/20 focus:ring-primary/40"><SelectValue placeholder="Select goal" /></SelectTrigger>
                      <SelectContent>
                        {LEARNING_GOALS.map(goal => <SelectItem key={goal} value={goal}>{goal}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell others about yourself..." className="min-h-[80px] rounded-xl bg-white/60 border-primary/20 focus:ring-primary/40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyTarget">Weekly Learning Target (hours)</Label>
                    <Input id="weeklyTarget" type="number" min="1" max="50" value={profile.weeklyTarget} onChange={e => setProfile({...profile, weeklyTarget: parseInt(e.target.value) || 5})} className="rounded-xl bg-white/60 border-primary/20 focus:ring-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notifications</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant={profile.notifications.email ? "default" : "outline"} onClick={() => toggleNotification("email")} className="flex items-center rounded-full"><Mail className="mr-2 h-4 w-4" />Email</Button>
                      <Button type="button" size="sm" variant={profile.notifications.push ? "default" : "outline"} onClick={() => toggleNotification("push")} className="flex items-center rounded-full"><Bell className="mr-2 h-4 w-4" />Push</Button>
                      <Button type="button" size="sm" variant={profile.notifications.calendar ? "default" : "outline"} onClick={() => toggleNotification("calendar")} className="flex items-center rounded-full"><CalendarClock className="mr-2 h-4 w-4" />Calendar</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <Select value={profile.visibility} onValueChange={value => setProfile({...profile, visibility: value})}>
                    <SelectTrigger id="visibility" className="rounded-xl bg-white/60 border-primary/20 focus:ring-primary/40"><SelectValue placeholder="Select visibility" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            ) : (
              <>
                {profile.bio ? (
                  <div className="mb-2 text-center text-muted-foreground italic animate-fade-in-up delay-200">{profile.bio}</div>
                ) : (
                  <div className="mb-2 text-center text-muted-foreground italic animate-fade-in-up delay-200">No bio provided</div>
                )}
                <div className="flex justify-center gap-8 mb-4 animate-fade-in-up delay-300">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Learning Goal</div>
                    <div className="font-medium flex items-center gap-1 justify-center"><Star className="h-4 w-4 text-primary" />{profile.goal}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Weekly Target</div>
                    <div className="font-medium">{profile.weeklyTarget} hours</div>
                  </div>
                </div>
                <div className="mb-4 animate-fade-in-up delay-400">
                  <div className="text-xs text-muted-foreground text-center mb-1">Notifications</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile.notifications.email && (<span className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center"><Mail className="h-3 w-3 mr-1" />Email</span>)}
                    {profile.notifications.push && (<span className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center"><Bell className="h-3 w-3 mr-1" />Push</span>)}
                    {profile.notifications.calendar && (<span className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center"><CalendarClock className="h-3 w-3 mr-1" />Calendar</span>)}
                  </div>
                </div>
                <div className="mb-2 text-center animate-fade-in-up delay-500">
                  <div className="text-xs text-muted-foreground mb-1">Visibility</div>
                  <span className="flex items-center justify-center gap-1"><Users className="h-4 w-4 mr-1" />{profile.visibility.charAt(0).toUpperCase() + profile.visibility.slice(1)}</span>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className={editing ? "flex justify-end px-14 pb-10 animate-fade-in-up delay-600" : "hidden"}>
            <Button onClick={handleSave} className="rounded-full px-10 py-3 text-xl font-bold shadow-md bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300 font-prism">Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Quicksand:wght@500;700&display=swap');
        .font-prism {
          font-family: 'Montserrat', 'Quicksand', 'Segoe UI', 'Arial', sans-serif;
          letter-spacing: 0.01em;
        }
        .animate-gradient-move {
          animation: gradientMove 16s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-bubble-move {
          animation: bubbleMove 12s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-40px) scale(1.13); }
        }
        .animate-bubble-move2 {
          animation: bubbleMove2 18s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.11); }
        }
        .animate-bubble-move3 {
          animation: bubbleMove3 22s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove3 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.15); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export { Navbar };
