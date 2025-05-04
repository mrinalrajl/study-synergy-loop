import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { describe, it, expect, vi } from 'vitest';

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Navbar variant="home" />
      </BrowserRouter>
    );
    expect(screen.getByText('Study Synergy Loop')).toBeInTheDocument();
  });

  it('displays user name when provided', () => {
    render(
      <BrowserRouter>
        <Navbar variant="home" user={{ name: 'Test User' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
  });

  it('shows Remove Duplicates button when removeDuplicates function is provided', () => {
    render(
      <BrowserRouter>
        <Navbar variant="home" removeDuplicates={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByTitle('Remove duplicate items')).toBeInTheDocument();
  });

  it('calls removeDuplicates function when button is clicked', () => {
    const mockRemoveDuplicates = vi.fn();
    render(
      <BrowserRouter>
        <Navbar variant="home" removeDuplicates={mockRemoveDuplicates} />
      </BrowserRouter>
    );
    
    // Find the button by its title and click it
    const button = screen.getByTitle('Remove duplicate items');
    fireEvent.click(button);
    
    // Check if the function was called
    expect(mockRemoveDuplicates).toHaveBeenCalledTimes(1);
  });

  it('does not show Remove Duplicates button when removeDuplicates function is not provided', () => {
    render(
      <BrowserRouter>
        <Navbar variant="home" />
      </BrowserRouter>
    );
    
    // Try to find the button by its text content
    const button = screen.queryByText('Remove Duplicates');
    expect(button).not.toBeInTheDocument();
  });
});