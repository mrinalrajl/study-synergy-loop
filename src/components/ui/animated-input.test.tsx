import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedInput } from './animated-input';

describe('AnimatedInput', () => {
  it('renders correctly', () => {
    render(<AnimatedInput placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('handles focus state correctly', () => {
    render(<AnimatedInput placeholder="Test placeholder" />);
    const input = screen.getByPlaceholderText('Test placeholder');
    
    // Check initial state
    expect(document.querySelector('.scale-1')).not.toBeNull();
    
    // Trigger focus
    fireEvent.focus(input);
    
    // Check focused state (scale should change)
    expect(document.querySelector('.scale-1\\.02')).not.toBeNull();
    
    // Blur the input
    fireEvent.blur(input);
    
    // Check that it returns to normal scale
    expect(document.querySelector('.scale-1')).not.toBeNull();
  });

  it('handles value changes correctly', () => {
    const handleChange = jest.fn();
    render(<AnimatedInput placeholder="Test placeholder" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Test placeholder');
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'test value' } });
    
    // Check that onChange was called
    expect(handleChange).toHaveBeenCalled();
    
    // Check that the scale changes when there's a value
    expect(document.querySelector('.scale-1\\.02')).not.toBeNull();
  });
});