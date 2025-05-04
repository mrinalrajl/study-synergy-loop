import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[650px] relative">
        {/* Glass effect card */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-[2rem] shadow-2xl" />
        
        {/* Content */}
        <div className="relative bg-background/60 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 shadow-sm border border-border/40">
          <div className="space-y-3 mb-10">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground/90 animate-fade-in">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in [animation-delay:200ms]">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};