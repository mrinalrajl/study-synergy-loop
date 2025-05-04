import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { marked } from "marked";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import emailjs from "emailjs-com";

const Notes = () => {
  const [note, setNote] = useLocalStorage("notes", "");
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

  const sendNoteToEmail = async () => {
    if (!email || !note.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email and write a note before sending.",
        variant: "destructive",
      });
      return;
    }
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        "service_qmxmdxj", // Your actual EmailJS service ID
        "template_3vfln1d", // Your actual EmailJS template ID
        { note, to_email: email }, // Use 'to_email' as the variable name
        "u6z7NaFL0VxI_QWXR" // Your actual EmailJS public key
      );
      toast({
        title: "Note sent!",
        description: `Your note was sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Send failed",
        description: `Could not send note. Please try again. (${error?.text || error?.message || error})`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
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
          <Button size="sm" className="mt-2 mr-2" onClick={() => setEditing(true)}>
            {note ? "Edit Note" : "Add Note"}
          </Button>
          <input
            type="email"
            className="border rounded px-2 py-1 text-sm mr-2"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: 200 }}
          />
          <Button size="sm" onClick={sendNoteToEmail} disabled={sending}>
            {sending ? "Sending..." : "Send Note to Email"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Notes;