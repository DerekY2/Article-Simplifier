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
      setDialogOpen(false);
      setUploadProgress(10);

      // Get a direct upload token
      const { uploadUrl, token } = await api.generatePdfUploadToken();
      
      // Create a progress interval
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 80));
      }, 200);
      
      // Upload the file directly to the URL
      await fetch(uploadUrl, {
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
      navigate("/documents");
      // setIsUploading(false);

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. There was an error uploading your document. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <div>
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="space-y-4 w-full text-center">
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
                  className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center border-opacity-40 transition-colors ${!isUploading ? 'hover:border-opacity-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'} ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`} 
                  onDragOver={!isUploading ? handleDragOver : (e) => e.preventDefault()}
                  onDragLeave={!isUploading ? handleDragLeave : (e) => e.preventDefault()}
                  onDrop={!isUploading ? handleDrop : (e) => e.preventDefault()}
                  onClick={!isUploading ? () => fileInputRef.current?.click() : undefined}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      disabled={isUploading}
                    >
                      Choose file
                    </Button>
                  </div>
                </div>

                {selectedFile && !isUploading && (
                  <Button
                    className="w-full mt-4"
                    onClick={openDialog}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                )}
                
                {isUploading && (
                  <div className="mt-6 space-y-4">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-center text-gray-500">
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
                  disabled={isUploading}
                >
                  View My Documents
                </Button>
              </div>
            </div>
          </Card>
        </div>
        {/* <Card className="p-6">
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
                model. Try adding more properties to it!
              </p>
            </div>
          </div>
        </Card> */}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Provide details for your document. This information will help you identify and organize your documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={documentTitle} 
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}