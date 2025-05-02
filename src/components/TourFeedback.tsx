import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, SendHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface TourFeedbackProps {
  onClose: () => void;
}

export const TourFeedback = ({ onClose }: TourFeedbackProps) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Here you would typically send the feedback to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve the learning experience.",
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card border border-primary/20 rounded-xl shadow-2xl p-6 max-w-md w-full mx-auto"
    >
      <h3 className="text-xl font-semibold mb-4 text-center">How was your tour experience?</h3>
      
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="icon"
            className={`h-10 w-10 ${rating >= star ? 'text-yellow-500' : 'text-muted-foreground'}`}
            onClick={() => setRating(star)}
          >
            <Star className={`h-6 w-6 ${rating >= star ? 'fill-yellow-500' : ''}`} />
          </Button>
        ))}
      </div>

      <Textarea
        placeholder="Share your thoughts about the tour (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="mb-4 bg-background/50 border-primary/20"
      />

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Skip
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || isSubmitting}
          className="prism-btn"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
            />
          ) : (
            <SendHorizontal className="mr-2 h-4 w-4" />
          )}
          Submit Feedback
        </Button>
      </div>
    </motion.div>
  );
};