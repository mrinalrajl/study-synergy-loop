import { fetchGroq } from './groqClient';

// Types for quiz questions and answers
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // Index of the correct answer
  explanation: string;
}

export interface QuizHistory {
  date: number; // Timestamp
  topic: string;
  score: number;
  totalQuestions: number;
}

// Storage keys
const STORAGE_KEYS = {
  QUIZ_HISTORY: 'quiz_history',
  LAST_QUIZ_TOPIC: 'last_quiz_topic',
};

/**
 * Generate quiz questions using AI based on a topic
 * @param topic The topic to generate questions about
 * @param count Number of questions to generate (default: 5)
 * @param difficulty Difficulty level (default: 'mixed')
 */
export const generateQuizQuestions = async (
  topic: string,
  count: number = 5,
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed' = 'mixed'
): Promise<QuizQuestion[]> => {
  try {
    // Store the last quiz topic
    localStorage.setItem(STORAGE_KEYS.LAST_QUIZ_TOPIC, topic);
    
    // Create a prompt for the AI to generate quiz questions
    const prompt = `Generate ${count} multiple-choice quiz questions about "${topic}" with ${difficulty} difficulty level.
    
For each question, provide:
1. The question text
2. Four possible answer options
3. The index of the correct answer (0-3)
4. A brief explanation of why the answer is correct

Format the response as a valid JSON array of objects with the following structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 2,
    "explanation": "Explanation of why Option C is correct."
  },
  ...
]

Make sure the questions are diverse and cover different aspects of the topic. The difficulty level should be appropriate for ${difficulty} learners.`;

    // Try to use Groq first, fall back to Gemini if it fails
    let aiResponse;
    try {
      aiResponse = await fetchGroq(prompt);
    } catch (error) {
      console.log('Groq failed, trying Gemini', error);
      aiResponse = await fetchGemini(prompt);
    }

    // Parse the response as JSON
    try {
      const parsedQuestions = JSON.parse(aiResponse);
      
      // Validate the response format
      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        // Ensure each question has the required properties
        const validQuestions = parsedQuestions.filter((q: any) => 
          q.question && 
          Array.isArray(q.options) && 
          q.options.length === 4 && 
          typeof q.answer === 'number' && 
          q.explanation
        );
        
        if (validQuestions.length > 0) {
          return validQuestions;
        }
      }
      
      // If we get here, the response wasn't valid
      throw new Error('Invalid response format from AI');
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to generate quiz questions');
    }
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    // Return fallback questions if AI generation fails
    return getFallbackQuestions(topic);
  }
};

/**
 * Get fallback questions if AI generation fails
 */
const getFallbackQuestions = (topic: string): QuizQuestion[] => {
  // Generic questions that can work for most topics
  return [
    {
      question: `What is a key concept in ${topic}?`,
      options: ["Concept A", "Concept B", "Concept C", "Concept D"],
      answer: 2,
      explanation: `Concept C is a fundamental principle in ${topic}.`
    },
    {
      question: `Which of the following is NOT related to ${topic}?`,
      options: ["Related term", "Another related term", "Unrelated term", "Yet another related term"],
      answer: 2,
      explanation: `"Unrelated term" is not associated with ${topic}.`
    },
    {
      question: `Who is considered a pioneer in the field of ${topic}?`,
      options: ["Person A", "Person B", "Person C", "Person D"],
      answer: 1,
      explanation: `Person B made significant contributions to the development of ${topic}.`
    }
  ];
};

/**
 * Save quiz result to history
 */
export const saveQuizResult = (topic: string, score: number, totalQuestions: number): void => {
  try {
    const history = getQuizHistory();
    
    history.push({
      date: Date.now(),
      topic,
      score,
      totalQuestions
    });
    
    // Keep only the last 10 quiz results
    const recentHistory = history.slice(-10);
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(recentHistory));
    
    // Set quiz_master achievement if score is perfect
    if (score === totalQuestions) {
      localStorage.setItem("quiz_master", "true");
    }
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

/**
 * Get quiz history
 */
export const getQuizHistory = (): QuizHistory[] => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return [];
  }
};

/**
 * Get the last quiz topic
 */
export const getLastQuizTopic = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_QUIZ_TOPIC) || '';
  } catch (error) {
    console.error('Error getting last quiz topic:', error);
    return '';
  }
};

/**
 * Calculate quiz statistics
 */
export const getQuizStatistics = () => {
  const history = getQuizHistory();
  
  if (history.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      recentTopics: []
    };
  }
  
  const totalQuizzes = history.length;
  const totalScore = history.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0);
  const averageScore = Math.round(totalScore / totalQuizzes);
  const bestScore = Math.max(...history.map(quiz => (quiz.score / quiz.totalQuestions) * 100));
  
  // Get unique recent topics
  const recentTopics = [...new Set(history.slice(-5).map(quiz => quiz.topic))];
  
  return {
    totalQuizzes,
    averageScore,
    bestScore,
    recentTopics
  };
};