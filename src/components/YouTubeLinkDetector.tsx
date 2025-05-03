
import { useState, useEffect, useCallback } from "react";
import { fetchGemini } from "@/lib/geminiClient";
import { YouTubeLearningModal } from "./YouTubeLearningModal";
import { useToast } from "@/hooks/use-toast";

export const YouTubeLinkDetector = () => {
  const [showModal, setShowModal] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);
  const [recommendations, setRecommendations] = useState<{
    summary: string;
    resources: string[];
    keyConcepts: string[];
    challenges: string[];
    tools: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // YouTube link regex pattern
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const extractYouTubeVideoId = (text: string): string | null => {
    const match = text.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const fetchVideoInfo = async (videoId: string) => {
    try {
      // For demo purposes we're just using the ID and constructing a URL
      // In a real app, you might want to use YouTube API to get more information
      return {
        id: videoId,
        title: "YouTube Video",
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    } catch (error) {
      console.error("Error fetching video info:", error);
      return null;
    }
  };

  const generateRecommendations = async (videoInfo: {
    id: string;
    title: string;
    url: string;
  }) => {
    setIsLoading(true);
    try {
      const prompt = `
You are an expert learning assistant analyzing a YouTube video at ${videoInfo.url}.
Generate a comprehensive learning guide that includes:

1. A brief summary of the likely content (based on the URL, without having watched it)
2. Five recommended learning resources to supplement this video
3. Key concepts the viewer should understand before watching
4. Common learning challenges and how to overcome them
5. Tools and technologies that might be referenced

Format your response as a JSON object with these fields: summary, resources (array), keyConcepts (array), challenges (array), tools (array).
Keep each item in the arrays brief and focused (1-2 sentences maximum).
`;

      const response = await fetchGemini(prompt);
      try {
        // Try to parse the response as JSON
        const jsonResponse = JSON.parse(response);
        setRecommendations(jsonResponse);
      } catch (error) {
        // If parsing fails, use regex to extract information
        console.warn("Failed to parse JSON response, using fallback extraction");
        
        // Basic fallback extraction using regex
        const summary = response.match(/summary["\s:]+([^"]+)/i)?.[1] || 
          "Unable to generate summary. Please check the video directly.";
          
        const resources = (response.match(/resources["\s:]+\[(.*?)\]/s)?.[1] || "")
          .split(",")
          .map(item => item.trim().replace(/^["']|["']$/g, ""))
          .filter(item => item.length > 0);
        
        const keyConcepts = (response.match(/keyConcepts["\s:]+\[(.*?)\]/s)?.[1] || "")
          .split(",")
          .map(item => item.trim().replace(/^["']|["']$/g, ""))
          .filter(item => item.length > 0);
        
        const challenges = (response.match(/challenges["\s:]+\[(.*?)\]/s)?.[1] || "")
          .split(",")
          .map(item => item.trim().replace(/^["']|["']$/g, ""))
          .filter(item => item.length > 0);
        
        const tools = (response.match(/tools["\s:]+\[(.*?)\]/s)?.[1] || "")
          .split(",")
          .map(item => item.trim().replace(/^["']|["']$/g, ""))
          .filter(item => item.length > 0);
          
        setRecommendations({
          summary,
          resources: resources.length ? resources : ["Official documentation", "Related YouTube tutorials"],
          keyConcepts: keyConcepts.length ? keyConcepts : ["Basic concepts related to the topic"],
          challenges: challenges.length ? challenges : ["Understanding complex topics", "Practical application"],
          tools: tools.length ? tools : ["Relevant development tools"]
        });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate learning recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData("text") || "";
    const videoId = extractYouTubeVideoId(text);
    
    if (videoId) {
      const info = await fetchVideoInfo(videoId);
      if (info) {
        setVideoInfo(info);
        setShowModal(true);
        generateRecommendations(info);
        
        toast({
          title: "YouTube link detected!",
          description: "Generating learning recommendations for you...",
          duration: 3000,
        });
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return (
    <>
      {showModal && videoInfo && (
        <YouTubeLearningModal
          videoInfo={videoInfo}
          recommendations={recommendations}
          isLoading={isLoading}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
