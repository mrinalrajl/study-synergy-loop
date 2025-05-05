import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';

// Mock console.error to prevent test output pollution
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('NotFound Component', () => {
  it('renders the 404 page with correct elements', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <NotFound />
      </MemoryRouter>
    );

    // Check if the main elements are rendered
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('displays the attempted path', () => {
    const testPath = '/test-non-existent-route';
    
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <NotFound />
      </MemoryRouter>
    );

    // Check if the attempted path is displayed
    expect(screen.getByText(`Attempted path: ${testPath}`, { exact: false })).toBeInTheDocument();
  });

  it('logs error message to console', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const testPath = '/another-non-existent-route';
    
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <NotFound />
      </MemoryRouter>
    );

    // Check if console.error was called with the correct message
    expect(consoleSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      testPath
    );
  });

  it('renders correctly when accessed through routing', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-path']}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the main elements are rendered
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});