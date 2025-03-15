import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { api } from "../api";
import { AutoForm } from "../components/auto";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { useFindMany, useActionForm } from "@gadgetinc/react";
import { Plus, FileText, Trash2, RefreshCw, Upload, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const navigate = useNavigate();
  const [{ data, error, fetching }, refresh] = useFindMany(api.document, {
    sort: { createdAt: "Descending" },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      pdfFile: {
        url: true,
        fileName: true,
      },
    },
  });

  // File upload states
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadToken, setUploadToken] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for step 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const resetUploadState = () => {
    setUploadStep(1);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadedFile(null);
    setUploadToken(null);
    setTitle("");
    setDescription("");
  };

  const handleCreateSuccess = () => {
    setDialogOpen(false);
    resetUploadState();
    setActiveTab("list");
    refresh();
    toast.success("Document uploaded successfully!");
  };

  // File upload handling
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(10);

    try {
      // Get direct upload token
      const { url, token } = await api.getDirectUploadToken();
      setUploadProgress(30);

      // Upload file to storage
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      
      setUploadProgress(90);
      setUploadToken(token);
      setUploadStatus('success');
      setUploadProgress(100);
      
      // Move to step 2
      setTimeout(() => {
        setUploadStep(2);
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus('error');
      toast.error("Failed to upload file. Please try again.");
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };
  
  // Handle form submission for step 2
  const handleSubmitDocument = async () => {
    if (!uploadToken || !uploadedFile) {
      toast.error("No file uploaded");
      return;
    }
    
    try {
      await api.document.create({
        title: title || uploadedFile.name,
        description,
        pdfFile: {
          directUploadToken: uploadToken,
          fileName: uploadedFile.name
        }
      });
      
      handleCreateSuccess();
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to save document. Please try again.");
    }
  };
  
  // Function to handle viewing a simplified document
  const viewSimplified = async (documentId: string) => {
    // First check if a simplified document exists
    const simplifiedDocs = await api.simplifiedDocument.findMany({
      filter: { originalDocumentId: { equals: documentId } },
      first: 1,
    });

    if (simplifiedDocs.length > 0) {
      // Navigate to a view page for the simplified document
      // This is just a placeholder - you would implement the actual view page separately
      window.open(`/simplified/${simplifiedDocs[0].id}`, "_blank");
    } else {
      // Show some notification that no simplified version exists yet
      toast.error("No simplified version exists for this document yet.");
    }
  };

  // Function to generate a new simplification
  const generateSimplification = async (documentId: string) => {
    try {
      // Navigate to a page where the user can create a new simplification
      navigate(`/create-simplification/${documentId}`);
    } catch (error) {
      console.error("Error generating simplification:", error);
    }
  };

  // Function to delete a document
  const deleteDocument = async (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await api.document.delete(documentId);
        refresh();
        toast.success("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document");
      }
    }
  };

  // Upload Dialog UI
  const renderUploadDialogContent = () => {
    if (uploadStep === 1) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Upload PDF Document</DialogTitle>
          </DialogHeader>
          <div className="my-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging 
                  ? 'border-primary bg-primary/10' 
                  : uploadStatus === 'error' 
                    ? 'border-destructive' 
                    : 'border-input hover:border-primary hover:bg-accent/40'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadStatus === 'idle' && (
                <>
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-1">Drag & drop your PDF file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                  <Button size="sm" variant="secondary" onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}>
                    Select File
                  </Button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".pdf" 
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </>
              )}
              
              {uploadStatus === 'uploading' && (
                <>
                  <FileText className="h-10 w-10 mx-auto mb-4 text-primary animate-pulse" />
                  <p className="text-lg font-medium mb-4">Uploading file...</p>
                  <Progress value={uploadProgress} className="h-2 w-full max-w-md mx-auto" />
                </>
              )}
              
              {uploadStatus === 'success' && uploadedFile && (
                <>
                  <FileText className="h-10 w-10 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium mb-1">Upload complete!</p>
                  <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                </>
              )}
              
              {uploadStatus === 'error' && (
                <>
                  <div className="text-destructive mb-2">
                    <Upload className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-lg font-medium">Upload failed</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Please try again</p>
                  <Button size="sm" variant="secondary" onClick={(e) => {
                    e.stopPropagation();
                    setUploadStatus('idle');
                  }}>
                    Retry
                  </Button>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </>
      );
    } else if (uploadStep === 2) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {uploadedFile && (
              <div className="flex items-center gap-3 p-3 border rounded-md bg-accent/20">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder={uploadedFile?.name || "Document title"} 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Add a description..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setUploadStep(1)}
              type="button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change File
            </Button>
            <Button 
              onClick={handleSubmitDocument}
              disabled={!uploadToken}
              type="button"
            >
              Save Document
            </Button>
          </DialogFooter>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">
          Upload, manage, and simplify your documents
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload New
          </TabsTrigger>
          <TabsTrigger value="list">
            <FileText className="mr-2 h-4 w-4" />
            Your Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>
                Upload a PDF file with a title and description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    resetUploadState();
                    setDialogOpen(true);
                  }} className="w-full md:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  {renderUploadDialogContent()}
                </DialogContent>
              </Dialog>
              
              <p className="text-sm text-muted-foreground mt-4">
                Click the button above to upload a PDF document. You'll be able to add details after selecting the file.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>
                Manage your uploaded documents and create simplifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetching ? (
                <div className="text-center py-8">Loading documents...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">
                  Error loading documents: {error.message}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">Date Uploaded</th>
                        <th className="text-center py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!data || data.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-8">
                            No documents found. Upload a document to get started.
                          </td>
                        </tr>
                      ) : (
                        data.map((document) => (
                          <tr key={document.id} className="border-b bg-white bg-opacity-0 hover:bg-opacity-10">
                            <td className="py-4 px-4">
                              <a 
                                href={document.pdfFile.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="font-medium text-blue-600 hover:underline"
                              >
                                {document.title}
                              </a>
                            </td>
                            <td className="py-4 px-4">
                              {document.description || "No description"}
                            </td>
                            <td className="py-4 px-4">
                              {format(new Date(document.createdAt), "PPP")}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewSimplified(document.id)}
                                >
                                  View Simplified
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateSimplification(document.id)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Simplify
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteDocument(document.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}