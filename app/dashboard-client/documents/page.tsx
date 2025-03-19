"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  FileText,
  MessageSquare,
  Circle,
  CheckCircle2,
  AlertCircle,
  Search,
  FolderOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentService } from "@/services/document.service";

const documentService = new DocumentService();

interface Document {
  id: string;
  title: string;
  registrantName: string;
  status: 'PENDING' | 'REVIEWING' | 'COMPLETED' | 'REJECTED';
  notes: string | null;
  fileUrl: string | null;
  apostilledFileUrl: string | null;
  batchId: string | null;
  batch?: {
    id: string;
    name: string;
    status: string;
    progress: number;
  };
  createdAt: string;
}

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.findAll('1'); // Simulating current user ID
      setDocuments(data.map((doc: any) => ({
        ...doc,
        status: doc.status as 'PENDING' | 'REVIEWING' | 'COMPLETED' | 'REJECTED',
      })));
    } catch (error) {
      toast.error("Erro ao carregar documentos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddObservation = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: observation }),
      });

      if (!response.ok) throw new Error('Failed to add observation');

      toast.success("Observação adicionada com sucesso");
      setObservation("");
      fetchDocuments();
    } catch (error) {
      toast.error("Erro ao adicionar observação");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-gray-200" />;
      case 'PENDING':
        return <Circle className="h-5 w-5 text-gray-200" />;
      case 'REVIEWING':
        return <Circle className="h-5 w-5 text-gray-200" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-gray-200" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Concluído';
      case 'PENDING':
        return 'Pendente';
      case 'REVIEWING':
        return 'Em Análise';
      case 'REJECTED':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.registrantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-96">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Meus Documentos</h2>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredDocuments.length === 0 && (
        <Alert>
          <AlertDescription>
            Nenhum documento encontrado.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{document.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {document.registrantName}
                </p>
                {document.batch && (
                  <div className="flex items-center gap-2 mt-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Lote: {document.batch.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {document.fileUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Documento Original
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Visualizar Documento Original</DialogTitle>
                      </DialogHeader>
                      <PDFViewer url={document.fileUrl} />
                    </DialogContent>
                  </Dialog>
                )}

                {document.apostilledFileUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Documento Apostilado
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Visualizar Documento Apostilado</DialogTitle>
                      </DialogHeader>
                      <PDFViewer url={document.apostilledFileUrl} />
                    </DialogContent>
                  </Dialog>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Observações
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Observação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Textarea
                          value={observation}
                          onChange={(e) => setObservation(e.target.value)}
                          placeholder="Digite sua observação..."
                          className="h-32"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAddObservation(document.id)}
                      >
                        Salvar Observação
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Enviado em: {new Date(document.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(document.status)}
                  <span>Status: {getStatusText(document.status)}</span>
                </div>
                {document.notes && (
                  <div className="flex items-start gap-2 mt-4 p-3 bg-muted rounded-lg">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Observações:</p>
                      <p className="mt-1">{document.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}