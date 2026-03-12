import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LogOut, Moon, Sun, Trash2, User, Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({ title: "Signed out successfully" });
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Sign out first, then inform user
      await signOut();
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion.",
      });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account and preferences.</p>

          {/* Appearance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                Appearance
              </CardTitle>
              <CardDescription>Choose your preferred theme.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="text-foreground">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          {user ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-primary" />
                    Account
                  </CardTitle>
                  <CardDescription>Your account information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{user.email}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Admin</span>
                    </div>
                  )}
                  <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={deleting}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account</CardTitle>
                <CardDescription>Sign in to manage your account settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="hero" asChild>
                  <a href="/login">Sign In</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
