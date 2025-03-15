import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router";
import { useState, useRef, ChangeEvent } from "react";
import type { AuthOutletContext } from "./_user";
import { api } from "../api";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function () {
  const { gadgetConfig, user } = useOutletContext<AuthOutletContext>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Invalid file format. Please upload a PDF document");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Invalid file format. Please upload a PDF document");
        return;
      }
      setSelectedFile(file);
    }
  };

  const openDialog = () => {
    if (!selectedFile) {
      toast.error("No file selected. Please select a PDF document to upload");
      return;
    }
    
    // Use the file name as the initial document title
    const fileName = selectedFile.name.replace(".pdf", "");
    setDocumentTitle(fileName);
    setDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentTitle) {
      toast.error("Please provide both a file and a title");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Get a direct upload token
      const { url, token } = await api.getDirectUploadToken();
      
      // Create a progress interval
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 80));
      }, 200);
      
      // Upload the file directly to the URL
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });
      
      setUploadProgress(85);

      // Create the document with the token
      const result = await api.document.create({
        title: documentTitle,
        description: documentDescription,
        pdfFile: {
          directUploadToken: token,
          fileName: selectedFile.name,
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Upload successful. Your document has been uploaded and is being processed");

      // Navigate to documents page
      setTimeout(() => {
        navigate("/documents");
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. There was an error uploading your document. Please try again.");
    } finally {
      setIsUploading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <div>
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between p-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Welcome to Article Simplifier</h2>
                <div className="space-y-2">
                  <p className="text-base">
                    You made it into <b>{gadgetConfig.env.GADGET_APP}</b>!
                  </p>
                  <p className="text-base">
                    To get started, upload a PDF document below. Our system will process your document and create a simplified version for you.
                  </p>
                </div>
                
                <div 
                  className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <File className="h-12 w-12 text-gray-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : "Drag & drop your PDF here or click to browse"}
                      </p>
                      <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      Choose file
                    </Button>
                  </div>
                </div>

                {selectedFile && !isUploading && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={openDialog}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload Document
                    </Button>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2 mt-4">
                    <Progress value={uploadProgress} />
                    <p className="text-xs text-center text-gray-500">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-4 text-center">
                  or
                </p>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/documents");
                  }}
                  className="w-full"
                >
                  View My Documents
                </Button>
              </div>
              <img
                src="https://assets.gadget.dev/assets/default-app-assets/react-logo.svg"
                className="app-logo h-24 w-24"
                alt="logo"
              />
            </div>
          </Card>
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Current user</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  ID
                </dt>
                <dd className="text-base">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="text-base">{`${user.firstName} ${user.lastName}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd className="text-base">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created
                </dt>
                <dd className="text-base">
                  {user.createdAt.toLocaleString("en-US", { timeZone: "UTC" })} (in UTC)
                </dd>
              </div>
            </dl>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This data is fetched from your{" "}
                <a
                  href="/edit/development/models/user"
                  className="text-primary hover:underline"
                >
                  user
                </a>{" "}
                via your autogenerated API.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the upload area above to start processing your documents.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add title and description for your document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="document-title" className="w-20">
                Title
              </Label>
              <Input 
                id="document-title" 
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="flex-1"
                required
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Label htmlFor="document-description" className="w-20">
                Description
              </Label>
              <Input 
                id="document-description" 
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              Selected file: {selectedFile?.name}
            </div>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-xs text-center text-gray-500">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!documentTitle || isUploading}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
