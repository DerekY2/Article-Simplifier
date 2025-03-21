import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, FileText, CheckCircle } from "lucide-react";

export default function CreateSimplification() {
  const documentId = location.pathname.split('/').pop();
  const navigate = useNavigate();

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [notes, setNotes] = useState("");
  
  // Load the original document
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        const doc = await api.document.findOne(documentId as string, {
          select: {
            id: true,
            title: true,
            description: true,
            content: { markdown: true, truncatedHTML: true },
            pdfFile: { url: true }
          }
        });
        setDocument(doc);
        setError(null);
      } catch (err: any) {
        console.error("Error loading document:", err);
        setError(err?.message || "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  // Simulate AI processing to extract key points and create notes
  const processDocument = async () => {
    if (!document) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an AI service
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate generating notes
      const generatedNotes = `# Key Points from ${document.title}

* The document discusses important concepts related to the main topic
* Several key arguments are presented throughout the text
* The conclusion summarizes the main findings

## Summary
This is an AI-generated summary of the document, highlighting the most important points and concepts discussed.`;
      
      setNotes(generatedNotes);
      setError(null);
    } catch (err: any) {
      console.error("Error processing document:", err);
      setError(err?.message || "Failed to process document");
    } finally {
      setProcessing(false);
    }
  };

  // Save the enhanced document
  const handleSave = async () => {
    if (!documentId || !notes) {
      setError("Notes are required to save the enhanced document");
      return;
    }

    try {
      const result = await api.enhancedDocument.create({
        notes: {
          markdown: notes
        },
        originalDocument: {
          _link: documentId
        },
        user: {
          // The current user will be automatically linked based on the session
        }
      }, {
        select: {
          id: true,
          createdAt: true,
          notes: { markdown: true, truncatedHTML: true }
        }
      });
      
      setSuccess(true);
      
      // Navigate to the enhanced documents page after a short delay
      setTimeout(() => {
        navigate("/enhanced-documents");
      }, 1500);
      
    } catch (err: any) {
      console.error("Error saving enhanced document:", err);
      setError(err?.message || "Failed to save enhanced document");
    }
  };

  // Automatically start processing once the document is loaded
  useEffect(() => {
    if (document && !processing && notes === "") {
      processDocument();
    }
  }, [document]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="container max-w-4xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Generate Notes</CardTitle>
          <CardDescription>
            Analyzing document: {document?.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Processing document...</p>
              <p className="text-sm text-muted-foreground">
                Our AI is extracting key points and generating notes. This may take a moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-lg font-medium">Enhanced document saved successfully!</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Redirecting to your enhanced documents...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <Label htmlFor="notes">Generated Notes</Label>
                      <Textarea 
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[300px] font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/documents")}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={!notes || processing}
                    >
                      Save Enhanced Document
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}