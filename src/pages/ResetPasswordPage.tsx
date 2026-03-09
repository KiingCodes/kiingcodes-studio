import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import diamondLogo from "@/assets/jeweliq-diamond-logo.png";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a recovery session from the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    } else {
      // Also listen for auth state change with SIGNED_IN after recovery link
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <PageLayout>
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center relative overflow-hidden">
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
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto px-4 relative z-10"
        >
          <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
            {done ? (
              <div className="text-center py-4">
                <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Password Updated!</h1>
                <p className="text-muted-foreground text-sm">Redirecting you to sign in…</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Choose a strong password for your account.
                  </p>
                </div>

                {!isRecovery && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3 mb-4 text-center">
                    Invalid or expired reset link. Please request a new one.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      New Password
                    </label>
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
                        disabled={!isRecovery}
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
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="pl-10 bg-secondary/50"
                        disabled={!isRecovery}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={loading || !isRecovery}
                  >
                    {loading ? "Updating…" : "Update Password"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default ResetPasswordPage;
