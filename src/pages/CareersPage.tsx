import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Briefcase } from "lucide-react";

const CareersPage = () => {
  return (
    <PageLayout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
              Careers
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our <span className="text-gradient">Team</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20 max-w-md mx-auto"
          >
            <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              We Are Not Hiring at the Moment
            </h2>
            <p className="text-muted-foreground">
              Thank you for your interest in joining Jewel IQ. We don't have any open positions right now, but please check back soon for future opportunities.
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CareersPage;
