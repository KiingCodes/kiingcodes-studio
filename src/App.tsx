import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ServicesPage from "./pages/ServicesPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PortfolioPage from "./pages/PortfolioPage";
import FuseGigsPage from "./pages/FuseGigsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { TouchDiamonds } from "./components/TouchDiamonds";
import { ProtectedRoute } from "./components/portal/ProtectedRoute";
import { PortalLayout } from "./components/portal/PortalLayout";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalProjects from "./pages/portal/PortalProjects";
import PortalMessages from "./pages/portal/PortalMessages";
import PortalServiceRequests from "./pages/portal/PortalServiceRequests";
import PortalInvoices from "./pages/portal/PortalInvoices";
import PortalOnboarding from "./pages/portal/PortalOnboarding";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServiceRequests from "./pages/admin/AdminServiceRequests";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminClients from "./pages/admin/AdminClients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TouchDiamonds />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/fuse-gigs" element={<FuseGigsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              {/* Portal Routes */}
              <Route path="/portal/onboarding" element={<ProtectedRoute><PortalOnboarding /></ProtectedRoute>} />
              <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
                <Route index element={<PortalDashboard />} />
                <Route path="projects" element={<PortalProjects />} />
                <Route path="messages" element={<PortalMessages />} />
                <Route path="requests" element={<PortalServiceRequests />} />
                <Route path="invoices" element={<PortalInvoices />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
