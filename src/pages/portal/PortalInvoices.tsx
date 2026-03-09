import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Upload, Trash2, File, Image, FileArchive, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function PortalInvoices() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ["client-company", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_companies")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", company!.id)
        .order("created_at", { ascending: false });
      return data;
    },
    enabled: !!company,
  });

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ["client-files", company?.id],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("client-files")
        .list(company!.id, {
          sortBy: { column: "created_at", order: "desc" },
        });
      if (error) throw error;
      return data;
    },
    enabled: !!company,
  });

  const uploadFile = async (file: File) => {
    if (!company) return;
    
    setUploading(true);
    try {
      const filePath = `${company.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("client-files")
        .upload(filePath, file);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["client-files"] });
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (fileName: string) => {
    if (!company) return;
    
    const { data, error } = await supabase.storage
      .from("client-files")
      .download(`${company.id}/${fileName}`);
    
    if (error) {
      toast.error("Failed to download file");
      return;
    }
    
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteFile = useMutation({
    mutationFn: async (fileName: string) => {
      if (!company) return;
      const { error } = await supabase.storage
        .from("client-files")
        .remove([`${company.id}/${fileName}`]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-files"] });
      toast.success("File deleted");
    },
    onError: () => {
      toast.error("Failed to delete file");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      uploadFile(file);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-5 w-5 text-green-500" />;
    }
    if (["zip", "rar", "7z", "tar"].includes(ext || "")) {
      return <FileArchive className="h-5 w-5 text-yellow-500" />;
    }
    if (["pdf"].includes(ext || "")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const statusColors = {
    draft: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    sent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    paid: "bg-green-500/10 text-green-600 border-green-500/20",
    overdue: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invoices & Files</h1>
        <p className="text-muted-foreground">View invoices and manage project files</p>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : invoices?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No invoices yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices?.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.description || "—"}</TableCell>
                        <TableCell>
                          {invoice.currency} {invoice.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {invoice.due_date ? format(new Date(invoice.due_date), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Files</CardTitle>
              <div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload File
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : files?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm mt-2">Upload documents, images, or other project files</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files?.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="flex items-center gap-2">
                          {getFileIcon(file.name)}
                          <span className="font-medium truncate max-w-xs">
                            {file.name.replace(/^\d+-/, "")}
                          </span>
                        </TableCell>
                        <TableCell>{formatFileSize(file.metadata?.size || 0)}</TableCell>
                        <TableCell>
                          {file.created_at ? format(new Date(file.created_at), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => downloadFile(file.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteFile.mutate(file.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
