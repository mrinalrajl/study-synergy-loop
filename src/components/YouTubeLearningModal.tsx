import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
 import { Separator } from "@/components/ui/separator";
 import { Button } from "@/components/ui/button";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { BookOpen, BookUser, Code, Lightbulb, Video } from "lucide-react";
 import { Skeleton } from "@/components/ui/skeleton";
 
 interface YouTubeLearningModalProps {
   videoInfo: {
     id: string;
     title: string;
     url: string;
   };
   recommendations: {
     summary: string;
     resources: string[];
     keyConcepts: string[];
     challenges: string[];
     tools: string[];
   } | null;
   isLoading: boolean;
   onClose: () => void;
 }
 
 export const YouTubeLearningModal = ({
   videoInfo,
   recommendations,
   isLoading,
   onClose,
 }: YouTubeLearningModalProps) => {
   return (
     <Dialog open={true} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col bg-background">
         <DialogHeader className="pb-2">
           <DialogTitle className="flex items-center gap-2 text-primary">
             <Video className="h-5 w-5" />
             Learning Recommendations
           </DialogTitle>
           <CardDescription className="line-clamp-1">
             Based on YouTube video: {videoInfo.url}
           </CardDescription>
         </DialogHeader>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 h-full flex-1">
           <div className="md:col-span-1 h-full">
             <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
               <iframe
                 src={`https://www.youtube.com/embed/${videoInfo.id}`}
                 title="YouTube video player"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
                 className="w-full h-full"
               ></iframe>
             </div>
             
             {isLoading ? (
               <div className="mt-4 space-y-3">
                 <Skeleton className="w-full h-4" />
                 <Skeleton className="w-3/4 h-4" />
                 <Skeleton className="w-5/6 h-4" />
               </div>
             ) : recommendations ? (
               <div className="mt-4">
                 <h3 className="text-sm font-medium">Summary</h3>
                 <p className="text-sm text-muted-foreground mt-1">{recommendations.summary}</p>
               </div>
             ) : null}
           </div>
           
           <div className="md:col-span-2 h-full overflow-hidden flex flex-col">
             {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[...Array(4)].map((_, i) => (
                   <Card key={i}>
                     <CardHeader className="pb-2">
                       <Skeleton className="h-5 w-40" />
                     </CardHeader>
                     <CardContent>
                       <Skeleton className="h-4 w-full mb-2" />
                       <Skeleton className="h-4 w-5/6 mb-2" />
                       <Skeleton className="h-4 w-4/6" />
                     </CardContent>
                   </Card>
                 ))}
               </div>
             ) : recommendations ? (
               <Tabs defaultValue="resources" className="w-full h-full flex flex-col">
                 <TabsList className="mb-2">
                   <TabsTrigger value="resources" className="flex items-center gap-1">
                     <BookOpen className="h-4 w-4" />
                     <span className="hidden sm:inline">Resources</span>
                   </TabsTrigger>
                   <TabsTrigger value="concepts" className="flex items-center gap-1">
                     <BookUser className="h-4 w-4" />
                     <span className="hidden sm:inline">Concepts</span>
                   </TabsTrigger>
                   <TabsTrigger value="challenges" className="flex items-center gap-1">
                     <Lightbulb className="h-4 w-4" />
                     <span className="hidden sm:inline">Challenges</span>
                   </TabsTrigger>
                   <TabsTrigger value="tools" className="flex items-center gap-1">
                     <Code className="h-4 w-4" />
                     <span className="hidden sm:inline">Tools</span>
                   </TabsTrigger>
                 </TabsList>
                 
                 <ScrollArea className="flex-1 pr-4">
                   <TabsContent value="resources" className="mt-0">
                     <Card>
                       <CardHeader>
                         <CardTitle className="text-base flex items-center gap-2">
                           <BookOpen className="h-4 w-4" />
                           Recommended Learning Resources
                         </CardTitle>
                         <CardDescription>
                           Additional materials to enhance your learning
                         </CardDescription>
                       </CardHeader>
                       <CardContent>
                         <ul className="list-disc pl-5 space-y-2">
                           {recommendations.resources.map((resource, index) => (
                             <li key={index} className="text-sm">{resource}</li>
                           ))}
                         </ul>
                       </CardContent>
                     </Card>
                   </TabsContent>
                   
                   <TabsContent value="concepts" className="mt-0">
                     <Card>
                       <CardHeader>
                         <CardTitle className="text-base flex items-center gap-2">
                           <BookUser className="h-4 w-4" />
                           Key Concepts
                         </CardTitle>
                         <CardDescription>
                           Important concepts to understand before watching
                         </CardDescription>
                       </CardHeader>
                       <CardContent>
                         <ul className="list-disc pl-5 space-y-2">
                           {recommendations.keyConcepts.map((concept, index) => (
                             <li key={index} className="text-sm">{concept}</li>
                           ))}
                         </ul>
                       </CardContent>
                     </Card>
                   </TabsContent>
                   
                   <TabsContent value="challenges" className="mt-0">
                     <Card>
                       <CardHeader>
                         <CardTitle className="text-base flex items-center gap-2">
                           <Lightbulb className="h-4 w-4" />
                           Learning Challenges
                         </CardTitle>
                         <CardDescription>
                           Common difficulties and how to overcome them
                         </CardDescription>
                       </CardHeader>
                       <CardContent>
                         <ul className="list-disc pl-5 space-y-2">
                           {recommendations.challenges.map((challenge, index) => (
                             <li key={index} className="text-sm">{challenge}</li>
                           ))}
                         </ul>
                       </CardContent>
                     </Card>
                   </TabsContent>
                   
                   <TabsContent value="tools" className="mt-0">
                     <Card>
                       <CardHeader>
                         <CardTitle className="text-base flex items-center gap-2">
                           <Code className="h-4 w-4" />
                           Tools & Technologies
                         </CardTitle>
                         <CardDescription>
                           Tools that might be referenced in this video
                         </CardDescription>
                       </CardHeader>
                       <CardContent>
                         <ul className="list-disc pl-5 space-y-2">
                           {recommendations.tools.map((tool, index) => (
                             <li key={index} className="text-sm">{tool}</li>
                           ))}
                         </ul>
                       </CardContent>
                     </Card>
                   </TabsContent>
                 </ScrollArea>
               </Tabs>
             ) : (
               <div className="flex items-center justify-center h-full">
                 <p className="text-muted-foreground">Failed to load recommendations</p>
               </div>
             )}
           </div>
         </div>
         
         <DialogFooter>
           <Button onClick={onClose} className="ml-auto">
             Close
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };