
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { marked } from "marked";
import { useLocalStorage } from "@/hooks/use-local-storage";

const Notes = () => {
  const [note, setNote] = useLocalStorage("notes", "");
  const [editing, setEditing] = useState(false);

  const saveNote = () => {
    // No need to manually save to localStorage since useLocalStorage handles that
    setEditing(false);
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
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked(note || "*No notes yet.*") }} />
          <Button size="sm" className="mt-2" onClick={() => setEditing(true)}>
            {note ? "Edit Note" : "Add Note"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Notes;
