import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

// Mock the ThemeToggle component
vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

describe('Navbar Component', () => {
  const mockUser = { name: 'Test User' };
  const mockLogout = vi.fn();
  const mockOnSearchChange = vi.fn();
  const mockRemoveDuplicates = vi.fn();

  it('renders with full width and single row layout', () => {
    render(
      <BrowserRouter>
        <Navbar 
          variant="home" 
          user={mockUser}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          logout={mockLogout}
          removeDuplicates={mockRemoveDuplicates}
        />
      </BrowserRouter>
    );

    // Check if the navbar container has the full width class
    const navbarContainer = screen.getByRole('navigation').querySelector('div');
    expect(navbarContainer?.className).toContain('w-full');
    expect(navbarContainer?.className).not.toContain('max-w-7xl');

    // Check if all main elements are rendered in the navbar
    expect(screen.getByText('Study Synergy Loop')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for courses...')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByText('Remove Duplicates')).toBeInTheDocument();
  });

  it('renders welcome message when user is provided', () => {
    render(
      <BrowserRouter>
        <Navbar 
          variant="home" 
          user={mockUser}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
  });

  it('does not render search bar when onSearchChange is not provided', () => {
    render(
      <BrowserRouter>
        <Navbar 
          variant="home" 
          user={mockUser}
        />
      </BrowserRouter>
    );

    expect(screen.queryByPlaceholderText('Search for courses...')).not.toBeInTheDocument();
  });
});