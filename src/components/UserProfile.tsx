
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
    // In a real app, we would send this to the backend
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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="glass-container">
        <CardHeader className="relative">
          <div className="absolute right-4 top-4">
            <Button 
              variant={editing ? "default" : "outline"} 
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {editing ? (
                  <Input 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  profile.name || user?.name || "User"
                )}
              </CardTitle>
              <CardDescription>
                Member since {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((avatar, i) => (
                    <Avatar 
                      key={i}
                      className={`cursor-pointer transition-all ${profile.avatar === avatar ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                      onClick={() => setProfile({...profile, avatar})}
                    >
                      <AvatarImage src={avatar} alt={`Avatar option ${i+1}`} />
                    </Avatar>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell others about yourself..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Learning Goal</Label>
                <Select 
                  value={profile.goal} 
                  onValueChange={(value) => setProfile({...profile, goal: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_GOALS.map((goal) => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notifications</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={profile.notifications.email ? "default" : "outline"}
                    onClick={() => toggleNotification("email")}
                    className="flex items-center"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={profile.notifications.push ? "default" : "outline"}
                    onClick={() => toggleNotification("push")}
                    className="flex items-center"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Push
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={profile.notifications.calendar ? "default" : "outline"}
                    onClick={() => toggleNotification("calendar")}
                    className="flex items-center"
                  >
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Calendar
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyTarget">Weekly Learning Target (hours)</Label>
                <Input
                  id="weeklyTarget"
                  type="number"
                  min="1"
                  max="50"
                  value={profile.weeklyTarget}
                  onChange={(e) => setProfile({...profile, weeklyTarget: parseInt(e.target.value) || 5})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Profile Visibility</Label>
                <Select 
                  value={profile.visibility} 
                  onValueChange={(value) => setProfile({...profile, visibility: value})}
                >
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {profile.bio ? (
                <div>
                  <h3 className="font-medium text-lg mb-1">About</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No bio provided</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="font-medium text-sm mb-1">Learning Goal</h3>
                  <p className="text-muted-foreground flex items-center">
                    <Star className="h-4 w-4 mr-1 text-primary" />
                    {profile.goal}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Weekly Target</h3>
                  <p className="text-muted-foreground">
                    {profile.weeklyTarget} hours
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Notifications</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.notifications.email && (
                    <span className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </span>
                  )}
                  {profile.notifications.push && (
                    <span className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center">
                      <Bell className="h-3 w-3 mr-1" />
                      Push
                    </span>
                  )}
                  {profile.notifications.calendar && (
                    <span className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      Calendar
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Visibility</h3>
                <p className="text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {profile.visibility.charAt(0).toUpperCase() + profile.visibility.slice(1)}
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className={editing ? "flex justify-end" : "hidden"}>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
