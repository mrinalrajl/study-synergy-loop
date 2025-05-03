import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const RESOURCES = [
  {
    type: "video",
    title: "Intro to React",
    url: "https://www.youtube.com/embed/dGcsHMXbSOA"
  },
  {
    type: "blog",
    title: "Understanding Async/Await in JS",
    url: "https://blog.example.com/async-await"
  },
  {
    type: "pdf",
    title: "Machine Learning Basics (PDF)",
    url: "https://arxiv.org/pdf/1409.0473.pdf"
  }
];

const ResourceHub = () => {
  const [ratings, setRatings] = useState<(null | boolean)[]>(Array(RESOURCES.length).fill(null));

  const rate = (idx: number, up: boolean) => {
    const updated = [...ratings];
    updated[idx] = up;
    setRatings(updated);
  };

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Resource Hub</div>
      <ul className="space-y-4">
        {RESOURCES.map((res, i) => (
          <li key={i} className="bg-background/60 rounded p-2">
            <div className="font-medium mb-1">{res.title}</div>
            {res.type === "video" && (
              <div className="aspect-video rounded overflow-hidden mb-2">
                <iframe src={res.url} title={res.title} allowFullScreen className="w-full h-full"></iframe>
              </div>
            )}
            {res.type === "blog" && (
              <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Read Blog</a>
            )}
            {res.type === "pdf" && (
              <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open PDF</a>
            )}
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant={ratings[i] === true ? "default" : "outline"} onClick={() => rate(i, true)}>
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button size="sm" variant={ratings[i] === false ? "destructive" : "outline"} onClick={() => rate(i, false)}>
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ResourceHub;
