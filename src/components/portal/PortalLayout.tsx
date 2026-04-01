import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortalSidebar } from "./PortalSidebar";
import { PortalNotifications } from "./PortalNotifications";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/jeweliq-logo.png";

export function PortalLayout() {
  const { user } = useAuth();

  // Check onboarding status
  const { data: company, isLoading } = useQuery({
    queryKey: ["client-company", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_companies")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to onboarding if not completed
  if (!company || !company.onboarding_completed) {
    return <Navigate to="/portal/onboarding" replace />;
  }

  return (
    <SidebarProvider>
      <PortalNotifications companyId={company.id} />
      <div className="min-h-screen flex w-full">
        <PortalSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="ml-4" />
            <h2 className="ml-4 text-lg font-semibold">Client Portal</h2>
          </header>
          
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
