import { useFindMany, useAction } from "@gadgetinc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EnhancedDocuments() {
  const navigate = useNavigate();
  const [{ data: enhancedDocuments, fetching, error }] = useFindMany(api.enhancedDocument, {
    select: {
      id: true,
      createdAt: true,
      originalDocument: {
        id: true,
        title: true,
      },
      notes: {
        markdown: true
      },
      highlights: true
    },
    sort: { createdAt: "Descending" }
  });

  const [{ fetching: isDeleting }, deleteEnhancedDocument] = useAction(api.enhancedDocument.delete);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this enhanced document?")) {
      await deleteEnhancedDocument({ id });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Enhanced Documents</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Enhanced Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load enhanced documents: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {fetching ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : enhancedDocuments && enhancedDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original Document</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enhancedDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      {doc.originalDocument.title}
                    </TableCell>
                    <TableCell>{formatDate(doc.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/documents/${doc.originalDocument.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isDeleting}
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't created any enhanced documents yet.
              </p>
              <Button asChild>
                <Link to="/documents">Browse Documents</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}