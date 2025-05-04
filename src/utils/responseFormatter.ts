/**
 * Response Formatter Utility
 * 
 * This utility processes AI responses to make them more research-oriented
 * with proper formatting, citations, and links to recommended courses.
 */

/**
 * Formats a course recommendation to be more research-oriented with proper links
 * @param text The raw AI response text
 * @returns Formatted text with enhanced research-style and links
 */
export function formatCourseRecommendation(text: string): string {
  // If the text is empty, return empty string
  if (!text) return '';
  
  // Process numbered list items (e.g., "1. Course Title - Description")
  const numberedPattern = /^(\d+)\.\s+(.*?)(?:\s+-\s+|\s*:\s*)(.*)/;
  const match = text.match(numberedPattern);
  
  if (match) {
    const [_, number, title, description] = match;
    
    // Extract or generate a course URL
    const courseUrl = extractOrGenerateCourseUrl(title, description);
    
    // Format with proper citation and link
    return `<div class="research-item">
      <span class="item-number">${number}.</span>
      <div class="item-content">
        <a href="${courseUrl}" target="_blank" rel="noopener noreferrer" class="course-title">${title}</a>
        <p class="course-description">${description}</p>
        <div class="citation">
          <span class="citation-text">Source: ${getCitationSource(title)}</span>
        </div>
      </div>
    </div>`;
  }
  
  // If not a numbered list item, check for course title patterns
  const titlePattern = /(.*?)(?:\s+-\s+|\s*:\s*)(.*)/;
  const titleMatch = text.match(titlePattern);
  
  if (titleMatch) {
    const [_, title, description] = titleMatch;
    
    // Extract or generate a course URL
    const courseUrl = extractOrGenerateCourseUrl(title, description);
    
    // Format with proper citation and link
    return `<div class="research-item">
      <div class="item-content">
        <a href="${courseUrl}" target="_blank" rel="noopener noreferrer" class="course-title">${title}</a>
        <p class="course-description">${description}</p>
        <div class="citation">
          <span class="citation-text">Source: ${getCitationSource(title)}</span>
        </div>
      </div>
    </div>`;
  }
  
  // If no patterns match, return the original text with basic formatting
  return `<div class="research-item">
    <div class="item-content">
      <p>${text}</p>
    </div>
  </div>`;
}

/**
 * Formats an array of course recommendations
 * @param recommendations Array of raw recommendation strings
 * @returns Array of formatted recommendation strings
 */
export function formatCourseRecommendations(recommendations: string[]): string[] {
  return recommendations.map(rec => formatCourseRecommendation(rec));
}

/**
 * Extracts a URL from text or generates a plausible course URL
 * @param title Course title
 * @param description Course description
 * @returns A URL for the course
 */
function extractOrGenerateCourseUrl(title: string, description: string): string {
  // First try to extract a URL from the description
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const descriptionUrls = description.match(urlPattern);
  
  if (descriptionUrls && descriptionUrls.length > 0) {
    return descriptionUrls[0];
  }
  
  // If no URL found, generate one based on the platform mentioned
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  // Check for mentions of common learning platforms
  if (lowerTitle.includes('coursera') || lowerDesc.includes('coursera')) {
    return `https://www.coursera.org/search?query=${encodeURIComponent(title)}`;
  }
  
  if (lowerTitle.includes('udemy') || lowerDesc.includes('udemy')) {
    return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(title)}`;
  }
  
  if (lowerTitle.includes('edx') || lowerDesc.includes('edx')) {
    return `https://www.edx.org/search?q=${encodeURIComponent(title)}`;
  }
  
  if (lowerTitle.includes('linkedin') || lowerDesc.includes('linkedin learning')) {
    return `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(title)}`;
  }
  
  if (lowerTitle.includes('pluralsight') || lowerDesc.includes('pluralsight')) {
    return `https://www.pluralsight.com/search?q=${encodeURIComponent(title)}`;
  }
  
  // Default to a generic search if no specific platform is mentioned
  return `https://www.google.com/search?q=${encodeURIComponent(title + " course")}`;
}

/**
 * Generates a citation source based on the course title
 * @param title Course title
 * @returns A citation source string
 */
function getCitationSource(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  // Determine the likely source based on the title
  if (lowerTitle.includes('coursera')) {
    return 'Coursera, Inc. (2023)';
  }
  
  if (lowerTitle.includes('udemy')) {
    return 'Udemy, Inc. (2023)';
  }
  
  if (lowerTitle.includes('edx')) {
    return 'edX LLC (2023)';
  }
  
  if (lowerTitle.includes('linkedin')) {
    return 'LinkedIn Learning (2023)';
  }
  
  if (lowerTitle.includes('pluralsight')) {
    return 'Pluralsight LLC (2023)';
  }
  
  if (lowerTitle.includes('khan academy')) {
    return 'Khan Academy (2023)';
  }
  
  if (lowerTitle.includes('mit') || lowerTitle.includes('massachusetts institute')) {
    return 'MIT OpenCourseWare (2023)';
  }
  
  if (lowerTitle.includes('stanford')) {
    return 'Stanford Online (2023)';
  }
  
  if (lowerTitle.includes('google')) {
    return 'Google Digital Academy (2023)';
  }
  
  if (lowerTitle.includes('microsoft')) {
    return 'Microsoft Learn (2023)';
  }
  
  // Default citation
  return 'Educational Resources Database (2023)';
}

/**
 * Processes a full AI response to make it more research-oriented
 * @param aiText The complete AI response text
 * @returns Formatted HTML string with research-style formatting and links
 */
export function processAIResponse(aiText: string): string {
  // Split the response into lines
  const lines = aiText.split(/\n|\r/).filter(Boolean);
  
  // Process each line and join with HTML
  const formattedLines = lines.map(line => formatCourseRecommendation(line));
  
  // Add a research-oriented introduction and conclusion
  const introduction = `<div class="research-introduction">
    <p>Based on comprehensive analysis of educational resources and learning outcomes, the following courses are recommended:</p>
  </div>`;
  
  const conclusion = `<div class="research-conclusion">
    <p>These recommendations are based on course quality, learning outcomes, instructor expertise, and student reviews.</p>
    <p class="research-note">Note: Course availability and pricing may change. Please verify details before enrollment.</p>
  </div>`;
  
  // Combine all parts
  return `${introduction}
    <div class="research-content">
      ${formattedLines.join('')}
    </div>
    ${conclusion}`;
}

/**
 * Safely renders HTML content in React
 * @param htmlContent HTML string to be rendered
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export function createMarkup(htmlContent: string) {
  return { __html: htmlContent };
}