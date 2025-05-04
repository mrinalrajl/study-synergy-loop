import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedTextarea } from './animated-textarea';

describe('AnimatedTextarea', () => {
  it('renders correctly', () => {
    render(<AnimatedTextarea placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('handles focus state correctly', () => {
    render(<AnimatedTextarea placeholder="Test placeholder" />);
    const textarea = screen.getByPlaceholderText('Test placeholder');
    
    // Check initial state
    expect(document.querySelector('.scale-1')).not.toBeNull();
    
    // Trigger focus
    fireEvent.focus(textarea);
    
    // Check focused state (scale should change)
    expect(document.querySelector('.scale-1\\.02')).not.toBeNull();
    
    // Blur the textarea
    fireEvent.blur(textarea);
    
    // Check that it returns to normal scale
    expect(document.querySelector('.scale-1')).not.toBeNull();
  });

  it('handles value changes correctly', () => {
    const handleChange = jest.fn();
    render(<AnimatedTextarea placeholder="Test placeholder" onChange={handleChange} />);
    const textarea = screen.getByPlaceholderText('Test placeholder');
    
    // Type in the textarea
    fireEvent.change(textarea, { target: { value: 'test value' } });
    
    // Check that onChange was called
    expect(handleChange).toHaveBeenCalled();
    
    // Check that the scale changes when there's a value
    expect(document.querySelector('.scale-1\\.02')).not.toBeNull();
  });
});