import React from 'react';
import { InputAnimationDemo } from '@/components/ui/input-animation-demo';
import { Navbar } from '@/components/Navbar';

const InputAnimationDemoPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="home" />
      <div className="flex-1 container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Input Animation Demo</h1>
        <InputAnimationDemo />
      </div>
    </div>
  );
};

export default InputAnimationDemoPage;