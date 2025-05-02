import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("bookmarks") || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");

  const addBookmark = () => {
    if (input.trim()) {
      const updated = [...bookmarks, input.trim()];
      setBookmarks(updated);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setInput("");
    }
  };

  const removeBookmark = (idx: number) => {
    const updated = bookmarks.filter((_, i) => i !== idx);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2 flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-primary" /> Bookmarks
      </div>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 rounded border px-2 py-1 text-sm bg-background"
          placeholder="Add topic or URL..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addBookmark()}
        />
        <Button size="sm" onClick={addBookmark}>Add</Button>
      </div>
      <ul className="space-y-1">
        {bookmarks.length === 0 && <li className="text-xs text-muted-foreground">No bookmarks yet.</li>}
        {bookmarks.map((bm, i) => (
          <li key={i} className="flex justify-between items-center text-sm bg-background/60 rounded px-2 py-1">
            <span>{bm}</span>
            <Button size="sm" variant="ghost" onClick={() => removeBookmark(i)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Bookmarks;
