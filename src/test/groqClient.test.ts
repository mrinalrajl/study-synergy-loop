import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGroq } from '../lib/groqClient';
import { API_BASE_URL } from '../utils/api';

// Mock the fetch function
global.fetch = vi.fn();

describe('Groq Client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call the correct API endpoint with the right payload', async () => {
    // Mock a successful response
    const mockResponse = {
      text: 'This is a test response from Groq'
    };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Call the function with a test prompt
    const prompt = 'Test prompt';
    const result = await fetchGroq(prompt, { 
      baseUrl: `${API_BASE_URL}/api/groq`,
      includeHistory: false 
    });

    // Verify the fetch was called with the correct arguments
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    const [url, options] = (global.fetch as any).mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/api/groq`);
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    
    const payload = JSON.parse(options.body);
    expect(payload.prompt).toBe(prompt);
    
    // Verify the result is correct
    expect(result).toBe(mockResponse.text);
  });

  it('should handle API errors and retry', async () => {
    // Mock a failed response followed by a successful one
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ text: 'Success after retry' })
      });

    // Call the function
    const result = await fetchGroq('Test prompt', { 
      maxRetries: 1,
      retryDelay: 10, // Short delay for testing
      includeHistory: false
    });

    // Verify fetch was called twice (initial + retry)
    expect(global.fetch).toHaveBeenCalledTimes(2);
    
    // Verify the result is from the successful retry
    expect(result).toBe('Success after retry');
  });

  it('should throw an error after max retries', async () => {
    // Mock consistently failed responses
    (global.fetch as any).mockRejectedValue(new Error('Persistent network error'));

    // Call the function and expect it to throw
    await expect(fetchGroq('Test prompt', { 
      maxRetries: 2,
      retryDelay: 10,
      includeHistory: false
    })).rejects.toThrow('Persistent network error');

    // Verify fetch was called the expected number of times (initial + 2 retries)
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});