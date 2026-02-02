import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using Jewel IQ's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services</h2>
                <p className="mb-4">Jewel IQ provides web development and digital services including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Website design and development</li>
                  <li>Mobile application development</li>
                  <li>UI/UX design</li>
                  <li>E-commerce solutions</li>
                  <li>Technical consulting</li>
                  <li>Website maintenance and support</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Project Terms</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quotes:</strong> All project quotes are valid for 30 days from the date of issue.</li>
                  <li><strong>Deposits:</strong> A 50% deposit is required to commence work on any project.</li>
                  <li><strong>Timeline:</strong> Project timelines are estimates and may vary based on project complexity and client responsiveness.</li>
                  <li><strong>Revisions:</strong> Each package includes a specified number of revisions. Additional revisions may incur extra charges.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment is due as specified in your project agreement</li>
                  <li>We accept bank transfers and other agreed payment methods</li>
                  <li>Final project files and deployment will be completed upon receipt of full payment</li>
                  <li>Late payments may result in project suspension</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
                <p>
                  Upon full payment, clients receive full ownership of the custom work created specifically for their project. Jewel IQ retains the right to showcase completed projects in our portfolio unless otherwise agreed in writing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Client Responsibilities</h2>
                <p className="mb-4">Clients agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide necessary content, images, and materials in a timely manner</li>
                  <li>Provide feedback and approvals within reasonable timeframes</li>
                  <li>Ensure all provided content does not infringe on third-party rights</li>
                  <li>Maintain confidentiality of any login credentials provided</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p>
                  Jewel IQ shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cancellation and Refunds</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deposits are non-refundable once work has commenced</li>
                  <li>Cancellation requests must be made in writing</li>
                  <li>Partial refunds may be considered based on work completed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact</h2>
                <p>
                  For questions about these Terms of Service, please contact us:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> info@jeweliq.com<br />
                  <strong>Phone:</strong> +27 60 433 4341
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
