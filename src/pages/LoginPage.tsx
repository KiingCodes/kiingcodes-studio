import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import diamondLogo from "@/assets/jeweliq-diamond-logo.png";
import logo from "@/assets/jeweliq-logo.png";
import { AnimatedBackground } from "@/components/AnimatedBackground";

type View = "login" | "signup" | "forgot";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "login" || mode === "signup" || mode === "forgot") {
      setView(mode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === "forgot") {
        const { error } = await resetPassword(email);
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Check your email ✉️", description: "We sent you a password reset link." });
          setView("login");
        }
        return;
      }

      const { error } = view === "signup"
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else if (view === "signup") {
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
        <AnimatedBackground variant="vivid" className="z-0" />
        <img
          src={diamondLogo}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none opacity-20 z-0"
          style={{ filter: "drop-shadow(0 0 80px hsl(var(--primary) / 0.5))" }}
        />

        <div className="w-full max-w-md mx-auto px-4 relative z-10">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
            <div className="text-center mb-8">
              <img
                src={logo}
                alt="JewelIQ"
                className="h-28 mx-auto mb-5 object-contain"
              />
              <h1 className="text-2xl font-bold text-foreground">
                {view === "forgot" ? "Reset Password" : view === "signup" ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {view === "forgot"
                  ? "Enter your email and we'll send you a reset link"
                  : view === "signup"
                  ? "Sign up for a JewelIQ account"
                  : "Sign in to your JewelIQ account"}
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

              {view !== "forgot" && (
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
              )}

              {view === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : view === "forgot"
                  ? "Send Reset Link"
                  : view === "signup"
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {view === "forgot" ? (
                <button
                  onClick={() => setView("login")}
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </button>
              ) : view === "signup" ? (
                <>
                  Already have an account{" "}
                  <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account{" "}
                  <button onClick={() => setView("signup")} className="text-primary hover:underline font-medium">
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
