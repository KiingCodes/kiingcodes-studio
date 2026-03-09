import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Upload,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  FileText,
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string;
  description: string;
  requirements: string[] | null;
  responsibilities: string[] | null;
  salary_range: string | null;
  created_at: string;
}

const CareersPage = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    education: "",
    experience_years: "",
    portfolio_url: "",
    cover_letter: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(data as JobListing[]);
      if (data.length > 0) {
        setExpandedJob(data[0].id);
        setSelectedJob(data[0].id);
      }
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "CV must be under 10MB.", variant: "destructive" });
        return;
      }
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowed.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please upload a PDF or Word document.", variant: "destructive" });
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) {
      toast({ title: "Please select a job", variant: "destructive" });
      return;
    }
    if (!cvFile) {
      toast({ title: "Please upload your CV", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Upload CV
      const fileExt = cvFile.name.split(".").pop();
      const fileName = `${Date.now()}-${form.full_name.replace(/\s+/g, "_")}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("cv-uploads")
        .upload(fileName, cvFile);

      if (uploadError) throw uploadError;

      // Submit application
      const { error: insertError } = await supabase
        .from("job_applications")
        .insert({
          job_id: selectedJob,
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim() || null,
          education: form.education.trim() || null,
          experience_years: form.experience_years ? parseInt(form.experience_years) : null,
          portfolio_url: form.portfolio_url.trim() || null,
          cover_letter: form.cover_letter.trim() || null,
          cv_url: fileName,
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      toast({ title: "Application submitted! 🎉", description: "We'll review your application and get back to you." });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const typeColors: Record<string, string> = {
    "full-time": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "part-time": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    contract: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    freelance: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  if (submitted) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Application Received!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for applying. Our team will review your application and contact you if you're shortlisted.
            </p>
            <Button variant="hero" onClick={() => { setSubmitted(false); setForm({ full_name: "", email: "", phone: "", city: "", education: "", experience_years: "", portfolio_url: "", cover_letter: "" }); setCvFile(null); }}>
              Apply for Another Position
            </Button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">We're Hiring</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground">
              Be part of a team that builds intelligent systems with precision. We're looking for talented individuals who share our passion for excellence.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Open Positions</h2>
              <p className="text-muted-foreground">Check back soon for new opportunities.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {/* Job Listings */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Open Positions ({jobs.length})</h2>
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedJob === job.id ? "border-primary ring-1 ring-primary/20" : "border-border"
                      }`}
                      onClick={() => {
                        setSelectedJob(job.id);
                        setExpandedJob(expandedJob === job.id ? null : job.id);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{job.title}</CardTitle>
                          {expandedJob === job.id ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.department && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Briefcase className="w-3 h-3" /> {job.department}
                            </span>
                          )}
                          {job.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          )}
                          <Badge variant="outline" className={`text-[10px] ${typeColors[job.type] || ""}`}>
                            {job.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedJob === job.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <CardContent className="pt-0 space-y-4">
                              <p className="text-sm text-muted-foreground">{job.description}</p>
                              {job.salary_range && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4 text-primary" />
                                  <span className="text-foreground font-medium">{job.salary_range}</span>
                                </div>
                              )}
                              {job.requirements && job.requirements.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-2">Requirements</h4>
                                  <ul className="space-y-1">
                                    {job.requirements.map((req, idx) => (
                                      <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                                        <span className="text-primary mt-0.5">•</span> {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {job.responsibilities && job.responsibilities.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-2">Responsibilities</h4>
                                  <ul className="space-y-1">
                                    {job.responsibilities.map((resp, idx) => (
                                      <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                                        <span className="text-primary mt-0.5">•</span> {resp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Application Form */}
              <div className="lg:col-span-3">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      Apply Now
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedJob
                        ? `Applying for: ${jobs.find((j) => j.id === selectedJob)?.title}`
                        : "Select a position to apply"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name *</Label>
                          <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required placeholder="John Doe" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className="mt-1" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+27 12 345 6789" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="city">City / Location</Label>
                          <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Johannesburg" className="mt-1" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="education">Highest Education</Label>
                          <Input id="education" name="education" value={form.education} onChange={handleChange} placeholder="e.g. BSc Interior Design" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="experience_years">Years of Experience</Label>
                          <Input id="experience_years" name="experience_years" type="number" min="0" max="50" value={form.experience_years} onChange={handleChange} placeholder="e.g. 5" className="mt-1" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="portfolio_url">Portfolio URL</Label>
                        <Input id="portfolio_url" name="portfolio_url" type="url" value={form.portfolio_url} onChange={handleChange} placeholder="https://your-portfolio.com" className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="cover_letter">Cover Letter / Message</Label>
                        <Textarea id="cover_letter" name="cover_letter" value={form.cover_letter} onChange={handleChange} placeholder="Tell us why you're a great fit for this role..." rows={4} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="cv_upload">Upload CV / Resume *</Label>
                        <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                          <input
                            id="cv_upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {cvFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary">
                              <FileText className="w-5 h-5" />
                              <span className="text-sm font-medium">{cvFile.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag & drop
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                            </>
                          )}
                        </div>
                      </div>

                      <Button type="submit" variant="hero" className="w-full" disabled={submitting || !selectedJob}>
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Submit Application
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CareersPage;
