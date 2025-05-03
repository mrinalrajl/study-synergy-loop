
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, LockKeyhole, Eye, EyeOff, User } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ""
  });
  const { signup } = useAuth();

  const calculatePasswordStrength = (value: string) => {
    let score = 0;
    let message = "";

    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    switch (score) {
      case 0:
        message = "Too weak";
        break;
      case 1:
        message = "Weak";
        break;
      case 2:
        message = "Fair";
        break;
      case 3:
        message = "Good";
        break;
      case 4:
        message = "Strong";
        break;
    }

    setPasswordStrength({ score, message });
  };

  useEffect(() => {
    if (password) {
      calculatePasswordStrength(password);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(email, name, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join us to start your learning journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative animate-fade-in [animation-delay:400ms]">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <User size={16} />
            </div>
            <Input
              id="name"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-12 bg-background/50"
              required
              autoComplete="name"
              autoFocus
            />
          </div>

          <div className="relative animate-fade-in [animation-delay:600ms]">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <Mail size={16} />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-background/50"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2 animate-fade-in [animation-delay:800ms]">
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <LockKeyhole size={16} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-background/50"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {password && (
              <div className="space-y-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Password strength: {passwordStrength.message}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 animate-fade-in [animation-delay:1000ms]">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium glass-btn-strong"
            disabled={isLoading || passwordStrength.score < 3}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground animate-fade-in [animation-delay:1200ms]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Sign in instead
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
