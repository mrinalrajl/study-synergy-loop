
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { marked } from "marked";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const [note, setNote] = useLocalStorage("notes", "");
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const saveNote = () => {
    try {
      // No need to manually save to localStorage since useLocalStorage handles that
      setEditing(false);
      
      if (note.trim()) {
        toast({
          title: "Note saved",
          description: "Your note has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error saving note",
        description: "There was a problem saving your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRenderError = (e: React.SyntheticEvent<HTMLDivElement>) => {
    console.error("Error rendering markdown:", e);
  };

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Notes</div>
      {editing ? (
        <div>
          <Textarea
            className="w-full min-h-[80px]"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Write your notes in markdown..."
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={saveNote}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          <div 
            className="prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: marked(note || "*No notes yet.*") }}
            onError={handleRenderError}
          />
          <Button size="sm" className="mt-2" onClick={() => setEditing(true)}>
            {note ? "Edit Note" : "Add Note"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Notes;
