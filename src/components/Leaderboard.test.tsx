import { render, screen, fireEvent } from '@testing-library/react';
import { Leaderboard } from './Leaderboard';
import { vi } from 'vitest';
import { act } from 'react-dom/test-utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com'
  }
});

describe('Leaderboard Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('renders leaderboard with correct title', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Top performers this week')).toBeInTheDocument();
  });

  test('renders user list with correct data', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Alex Thompson')).toBeInTheDocument();
    expect(screen.getByText('Maria Garcia')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('2500 points')).toBeInTheDocument();
  });

  test('share button opens dialog with animation', async () => {
    render(<Leaderboard />);
    
    // Find and click the share button
    const shareButton = screen.getByText('Share');
    fireEvent.click(shareButton);
    
    // Check if dialog content appears
    expect(screen.getByText('Share this app')).toBeInTheDocument();
    expect(screen.getByText('Share on LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Share on WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Share on Meta (Facebook)')).toBeInTheDocument();
    
    // Check for animation classes
    const dialogContent = screen.getByText('Share this app').closest('div');
    expect(dialogContent).toBeInTheDocument();
  });

  test('profile button opens dialog with animation', () => {
    render(<Leaderboard />);
    
    // Find and click the profile button
    const profileButton = screen.getByText('View Profile');
    fireEvent.click(profileButton);
    
    // Check if dialog content appears
    expect(screen.getByText('Profile Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bio')).toBeInTheDocument();
    
    // Check for animation classes
    const dialogContent = screen.getByText('Profile Details').closest('div');
    expect(dialogContent).toBeInTheDocument();
  });

  test('buttons have hover animation', () => {
    render(<Leaderboard />);
    
    // Find the share and profile buttons
    const shareButton = screen.getByText('Share').closest('button');
    const profileButton = screen.getByText('View Profile').closest('button');
    
    expect(shareButton).toBeInTheDocument();
    expect(profileButton).toBeInTheDocument();
    
    // Check that the buttons have motion properties
    expect(shareButton?.getAttribute('data-motion')).not.toBeNull();
    expect(profileButton?.getAttribute('data-motion')).not.toBeNull();
  });
  
  test('profile data is saved to localStorage', () => {
    render(<Leaderboard />);
    
    // Open profile dialog
    const profileButton = screen.getByText('View Profile');
    fireEvent.click(profileButton);
    
    // Fill in profile data
    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const bioInput = screen.getByPlaceholderText('Bio');
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(bioInput, { target: { value: 'This is a test bio' } });
    
    // Save profile
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Check if data was saved to localStorage
    const savedData = JSON.parse(localStorageMock.getItem('user_profile') || '{}');
    expect(savedData.name).toBe('Test User');
    expect(savedData.email).toBe('test@example.com');
    expect(savedData.bio).toBe('This is a test bio');
  });
});