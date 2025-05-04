import React from 'react';
import { AnimatedInput } from './animated-input';
import { AnimatedTextarea } from './animated-textarea';
import { Card } from './card';

export function InputAnimationDemo() {
  return (
    <div className="space-y-8 p-4 max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Animated Input Fields</h2>
        <p className="text-muted-foreground mb-6">
          Start typing to see the animations in action
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <AnimatedInput 
              id="name" 
              placeholder="Enter your name" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <AnimatedInput 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <AnimatedTextarea 
              id="message" 
              placeholder="Type your message here" 
            />
          </div>
        </div>
      </Card>
    </div>
  );
}