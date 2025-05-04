import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { AnimatedInput } from "@/components/ui/animated-input";
import { Button } from "@/components/ui/button";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { PrismBackground } from "@/components/PrismBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative font-prism">
      <PrismBackground />
      <div className="w-full max-w-2xl mx-auto p-8 animate-ease-in-login">
        <AuthLayout 
          title="Welcome back" 
          subtitle="Enter your credentials to access your account"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="relative animate-fade-in [animation-delay:400ms]">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Mail size={18} />
                </div>
                <AnimatedInput
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-14 bg-background/50 text-lg"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="relative animate-fade-in [animation-delay:600ms]">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <LockKeyhole size={18} />
                </div>
                <AnimatedInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-14 bg-background/50 text-lg"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between animate-fade-in [animation-delay:800ms]">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-base text-muted-foreground">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-base font-medium text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-4 animate-fade-in [animation-delay:1000ms]">
              <Button
                type="submit"
                className="w-full h-14 text-lg font-medium glass-btn-strong"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <p className="text-center text-base text-muted-foreground animate-fade-in [animation-delay:1200ms]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary-hover transition-colors"
              >
                Create one now
              </Link>
            </p>
          </form>
        </AuthLayout>
      </div>
      <style>{`
        @keyframes easeInLogin {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-ease-in-login {
          animation: easeInLogin 1s cubic-bezier(.39,.575,.565,1) both;
        }
      `}</style>
    </div>
  );
};

export default Login;