import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="w-full max-w-[650px] relative">
      {/* Blended card with seamless background integration */}
      <div className="relative bg-background/40 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10">
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
  );
};