import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus, Users, Calendar, MessageSquare } from "lucide-react";
import { 
  getAllStudyGroups,
  getUserStudyGroups,
  joinStudyGroup,
  leaveStudyGroup,
  searchStudyGroups,
  StudyGroup
} from "@/lib/studyGroupService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);

  // Load groups on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    setIsLoading(true);
    try {
      const allGroups = getAllStudyGroups();
      const userGroupIds = getUserStudyGroups();
      
      setGroups(allGroups);
      setUserGroups(userGroupIds);
    } catch (error) {
      console.error("Error loading study groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    try {
      const results = searchStudyGroups(searchQuery);
      setGroups(results);
    } catch (error) {
      console.error("Error searching study groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = (groupId: string) => {
    const success = joinStudyGroup(groupId);
    if (success) {
      setUserGroups([...userGroups, groupId]);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    const success = leaveStudyGroup(groupId);
    if (success) {
      setUserGroups(userGroups.filter(id => id !== groupId));
    }
  };

  const handleViewGroup = (group: StudyGroup) => {
    setSelectedGroup(group);
    setShowGroupDetails(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-background/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Study Groups</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
                <DialogDescription>
                  Create a new study group to learn together with others.
                </DialogDescription>
              </DialogHeader>
              {/* Create group form will go here */}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input placeholder="Enter group name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Input placeholder="Main topic of study" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Describe your study group" />
                </div>
              </div>
              <DialogFooter>
                <Button>Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for study groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {groups.filter(group => group.isPublic).map((group) => (
                  <div
                    key={group.id}
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="mr-2">{group.topic}</span>
                        <span>{group.members.length} members</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewGroup(group)}
                      >
                        View
                      </Button>
                      {userGroups.includes(group.id) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {groups.filter(group => group.isPublic).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No study groups found. Try a different search or create a new group.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-groups" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {groups
                  .filter((group) => userGroups.includes(group.id))
                  .map((group) => (
                    <div
                      key={group.id}
                      className="p-3 border rounded-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{group.name}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewGroup(group)}
                        >
                          View
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        <span className="mr-2">{group.topic}</span>
                        <span>{group.members.length} members</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Sessions
                        </Button>
                      </div>
                    </div>
                  ))}
                {groups.filter((group) => userGroups.includes(group.id)).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't joined any study groups yet.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Group Details Dialog */}
      <Dialog open={showGroupDetails} onOpenChange={setShowGroupDetails}>
        <DialogContent className="max-w-3xl">
          {selectedGroup && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGroup.name}</DialogTitle>
                <DialogDescription>
                  {selectedGroup.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{selectedGroup.members.length} members</span>
                  <span className="mx-2">•</span>
                  <span>Created {formatDate(selectedGroup.createdAt)}</span>
                </div>
                
                <Tabs defaultValue="members">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="members" className="space-y-2 mt-2">
                    {selectedGroup.members.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined {formatDate(member.joinedAt)}
                          </div>
                        </div>
                        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {member.role}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="chat" className="space-y-2 mt-2">
                    <div className="border rounded-md p-2 h-64 overflow-y-auto space-y-2">
                      {selectedGroup.messages.length > 0 ? (
                        selectedGroup.messages.map((message) => (
                          <div key={message.id} className="text-sm">
                            <div className="font-medium">{message.memberName}</div>
                            <div>{message.content}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No messages yet. Start the conversation!
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." />
                      <Button>Send</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sessions" className="space-y-2 mt-2">
                    {selectedGroup.sessions.length > 0 ? (
                      selectedGroup.sessions.map((session) => (
                        <div key={session.id} className="border rounded-md p-3">
                          <div className="font-medium">{session.title}</div>
                          <div className="text-sm">{session.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(session.scheduledFor)} at {formatTime(session.scheduledFor)}
                            <span className="mx-1">•</span>
                            {session.duration} minutes
                          </div>
                          <Button size="sm" className="mt-2">Join Session</Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No scheduled sessions yet.
                      </div>
                    )}
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Session
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter>
                {userGroups.includes(selectedGroup.id) ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLeaveGroup(selectedGroup.id);
                      setShowGroupDetails(false);
                    }}
                  >
                    Leave Group
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleJoinGroup(selectedGroup.id);
                      setShowGroupDetails(false);
                    }}
                  >
                    Join Group
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StudyGroups;