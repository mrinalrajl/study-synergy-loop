import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Loombot } from './Loombot';
import * as aiService from '@/lib/aiService';
import { useState } from 'react';

// Mock the AI service
vi.mock('@/lib/aiService', () => ({
  fetchAI: vi.fn().mockResolvedValue('AI response'),
}));

// Mock the hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the useLocalStorage hook
vi.mock('@/hooks/use-local-storage', () => ({
  useLocalStorage: (key, initialValue) => {
    return useState(initialValue);
  },
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe('Loombot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Loombot button when closed', () => {
    render(<Loombot />);
    const button = screen.getByLabelText('Open Loombot');
    expect(button).toBeInTheDocument();
  });

  it('opens the chat window when button is clicked', async () => {
    render(<Loombot />);
    const button = screen.getByLabelText('Open Loombot');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Loombot')).toBeInTheDocument();
      expect(screen.getByText('Your video learning assistant')).toBeInTheDocument();
    });
  });
});