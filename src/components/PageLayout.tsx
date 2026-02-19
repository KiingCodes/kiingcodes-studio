import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OwamaChatbot } from "@/components/OwamaChatbot";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
      <Footer />
      <OwamaChatbot />
    </div>
  );
};
