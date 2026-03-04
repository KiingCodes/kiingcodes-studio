import { useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Download, Share2, Calendar, Palette, BarChart3, 
  PresentationIcon, Send, Clock, Link2, Copy, Check, Plus,
  Settings, Eye, Trash2, LogIn
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/jeweliq-logo.png";

interface Report {
  id: string;
  name: string;
  type: "pdf" | "slides" | "dashboard";
  createdAt: Date;
  scheduled: boolean;
  frequency?: string;
  recipientEmail?: string;
}

const MOCK_REPORTS: Report[] = [
  { id: "1", name: "Monthly Performance Summary", type: "pdf", createdAt: new Date(), scheduled: true, frequency: "monthly", recipientEmail: "client@example.com" },
  { id: "2", name: "Q1 2026 Client Presentation", type: "slides", createdAt: new Date(), scheduled: false },
  { id: "3", name: "Live Analytics Dashboard", type: "dashboard", createdAt: new Date(), scheduled: false },
];

const REPORT_SECTIONS = [
  { id: "overview", label: "Project Overview", icon: Eye },
  { id: "analytics", label: "Analytics & Metrics", icon: BarChart3 },
  { id: "timeline", label: "Timeline & Milestones", icon: Calendar },
  { id: "deliverables", label: "Deliverables", icon: FileText },
  { id: "budget", label: "Budget & Invoicing", icon: Settings },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports] = useState<Report[]>(MOCK_REPORTS);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");
  
  // Builder state
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState<string>("pdf");
  const [selectedSections, setSelectedSections] = useState<string[]>(["overview", "analytics"]);
  const [brandColor, setBrandColor] = useState("#0ea5e9");
  const [includeCompanyLogo, setIncludeCompanyLogo] = useState(true);
  const [scheduledDelivery, setScheduledDelivery] = useState(false);
  const [deliveryFrequency, setDeliveryFrequency] = useState("weekly");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  if (!user) {
    return (
      <PageLayout>
        <section className="min-h-[70vh] flex items-center justify-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <LogIn className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access the Reporting Export Centre.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </section>
      </PageLayout>
    );
  }

  const toggleSection = (id: string) => {
    setSelectedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Your ${reportType.toUpperCase()} report "${reportName || 'Untitled Report'}" is being generated...`,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/reports/shared/demo-${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied!",
      description: "Shareable dashboard link has been copied to your clipboard.",
    });
  };

  const handleSchedule = () => {
    if (!recipientEmail) {
      toast({ title: "Email required", description: "Please enter a recipient email for scheduled delivery.", variant: "destructive" });
      return;
    }
    toast({
      title: "Schedule Created ✨",
      description: `Report will be delivered ${deliveryFrequency} to ${recipientEmail}`,
    });
  };

  const typeIcons = { pdf: FileText, slides: PresentationIcon, dashboard: BarChart3 };

  return (
    <PageLayout>
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <FloatingDiamond className="top-32 right-16 opacity-10" size="w-20" delay={1} />
        <FloatingDiamond className="bottom-16 left-8 opacity-8" size="w-14" delay={4} duration={10} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reporting Export Centre
            </h1>
            <p className="text-lg text-muted-foreground">
              Create branded reports, schedule automated delivery, and share live dashboards with clients.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-card/50 border border-border/30 p-1">
              <TabsTrigger value="builder" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Report Builder
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4 mr-2" /> My Reports
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4 mr-2" /> Scheduled
              </TabsTrigger>
            </TabsList>

            {/* Report Builder */}
            <TabsContent value="builder">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Config */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 bg-card/50 border-border/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" /> Report Configuration
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Report Name</Label>
                        <Input 
                          placeholder="e.g. Monthly Performance Summary"
                          value={reportName}
                          onChange={e => setReportName(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select value={reportType} onValueChange={setReportType}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">📄 Branded PDF</SelectItem>
                            <SelectItem value="slides">📊 Presentation Slides</SelectItem>
                            <SelectItem value="dashboard">📈 Shareable Dashboard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 border-border/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" /> Report Sections
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {REPORT_SECTIONS.map(section => (
                        <button
                          key={section.id}
                          onClick={() => toggleSection(section.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                            selectedSections.includes(section.id)
                              ? "border-primary/50 bg-primary/10 text-foreground"
                              : "border-border/30 bg-background/30 text-muted-foreground hover:border-border"
                          }`}
                        >
                          <section.icon className={`w-5 h-5 ${selectedSections.includes(section.id) ? "text-primary" : ""}`} />
                          <span className="text-sm font-medium">{section.label}</span>
                          {selectedSections.includes(section.id) && <Check className="w-4 h-4 text-primary ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 border-border/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" /> Automated Delivery
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Scheduled Delivery</Label>
                          <p className="text-xs text-muted-foreground">Automatically send reports to clients</p>
                        </div>
                        <Switch checked={scheduledDelivery} onCheckedChange={setScheduledDelivery} />
                      </div>
                      {scheduledDelivery && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="grid sm:grid-cols-2 gap-4 pt-2"
                        >
                          <div className="space-y-2">
                            <Label>Recipient Email</Label>
                            <Input 
                              placeholder="client@example.com"
                              type="email"
                              value={recipientEmail}
                              onChange={e => setRecipientEmail(e.target.value)}
                              className="bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Frequency</Label>
                            <Select value={deliveryFrequency} onValueChange={setDeliveryFrequency}>
                              <SelectTrigger className="bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 border-border/30">
                    <Label>Custom Notes / Summary</Label>
                    <Textarea
                      placeholder="Add any custom notes or executive summary to include in the report..."
                      value={customNotes}
                      onChange={e => setCustomNotes(e.target.value)}
                      className="mt-2 bg-background/50 min-h-[100px]"
                    />
                  </Card>
                </div>

                {/* Branding & Preview */}
                <div className="space-y-6">
                  <Card className="p-6 bg-card/50 border-border/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" /> Custom Branding
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Include Company Logo</Label>
                        <Switch checked={includeCompanyLogo} onCheckedChange={setIncludeCompanyLogo} />
                      </div>
                      <div className="space-y-2">
                        <Label>Brand Colour</Label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={brandColor}
                            onChange={e => setBrandColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-border/30"
                          />
                          <Input value={brandColor} onChange={e => setBrandColor(e.target.value)} className="bg-background/50 flex-1" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Preview */}
                  <Card className="p-6 bg-card/50 border-border/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" /> Preview
                    </h3>
                    <div className="rounded-xl border border-border/30 bg-background/80 overflow-hidden">
                      <div className="p-4 border-b border-border/20" style={{ backgroundColor: brandColor + "15" }}>
                        <div className="flex items-center gap-3">
                          {includeCompanyLogo && <img src={logo} alt="Logo" className="h-6 w-auto" />}
                          <div>
                            <p className="text-xs font-semibold text-foreground">{reportName || "Untitled Report"}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        {selectedSections.map(s => {
                          const sec = REPORT_SECTIONS.find(rs => rs.id === s);
                          return sec ? (
                            <div key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brandColor }} />
                              {sec.label}
                            </div>
                          ) : null;
                        })}
                        {selectedSections.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">Select sections to include</p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button onClick={handleExport} className="w-full" variant="hero" size="lg">
                      <Download className="w-4 h-4 mr-2" /> Export {reportType === "pdf" ? "PDF" : reportType === "slides" ? "Slides" : "Dashboard"}
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="w-full" size="lg">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                      {copied ? "Copied!" : "Get Shareable Link"}
                    </Button>
                    {scheduledDelivery && (
                      <Button onClick={handleSchedule} variant="outline" className="w-full" size="lg">
                        <Clock className="w-4 h-4 mr-2" /> Schedule Delivery
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* My Reports */}
            <TabsContent value="reports">
              <div className="grid gap-4">
                {reports.map((report, i) => {
                  const Icon = typeIcons[report.type];
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="p-5 bg-card/50 border-border/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{report.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px]">
                              {report.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {report.createdAt.toLocaleDateString()}
                            </span>
                            {report.scheduled && (
                              <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                <Clock className="w-2.5 h-2.5 mr-1" /> {report.frequency}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Scheduled */}
            <TabsContent value="schedule">
              <div className="grid gap-4">
                {reports.filter(r => r.scheduled).map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-5 bg-card/50 border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Delivers <span className="text-primary font-medium">{report.frequency}</span> to {report.recipientEmail}
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {reports.filter(r => r.scheduled).length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No scheduled reports yet. Create one in the Report Builder.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
}
