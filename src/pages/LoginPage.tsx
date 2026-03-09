import { useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import diamondLogo from "@/assets/jeweliq-diamond-logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else if (isSignUp) {
        toast({ title: "Check your email", description: "We sent you a confirmation link." });
      } else {
        toast({ title: "Welcome back! ✨" });
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Diamond background */}
        <motion.img
          src={diamondLogo}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none opacity-10"
          style={{ filter: "drop-shadow(0 0 80px hsl(var(--primary) / 0.5))" }}
          animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto px-4"
        >
          <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
            <div className="text-center mb-8">
              <img 
                src="/src/assets/jeweliq-logo.png" 
                alt="JewelIQ" 
                className="h-32 mx-auto mb-6"
                style={{ animation: "spin 1s ease-in-out 1" }}
              />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <h1 className="text-2xl font-bold text-foreground">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {isSignUp ? "Sign up for a JewelIQ account" : "Sign in to your JewelIQ account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-10 bg-secondary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-10 pr-10 bg-secondary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
