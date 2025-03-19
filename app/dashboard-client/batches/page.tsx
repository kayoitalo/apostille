"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  MessageSquare,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Document {
  id: string;
  title: string;
  registrantName: string;
  status: 'PENDING' | 'REVIEWING' | 'COMPLETED' | 'REJECTED';
  notes: string | null;
  fileUrl: string | null;
  createdAt: string;
}

interface Batch {
  id: string;
  name: string;
  notes: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  progress: number;
  documents: Document[];
  createdAt: string;
}

// Example data to show how split documents would appear
const EXAMPLE_BATCHES: Batch[] = [
  {
    id: '1',
    name: 'Certidões Janeiro 2024',
    notes: 'Documentos urgentes para apostilamento',
    status: 'PROCESSING',
    progress: 75,
    createdAt: '2024-01-15T10:00:00Z',
    documents: [
      {
        id: '1',
        title: 'Certidão de Nascimento',
        registrantName: 'João da Silva',
        status: 'COMPLETED',
        notes: 'Documento processado e apostilado',
        fileUrl: 'https://example.com/doc1.pdf',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        title: 'Certidão de Casamento',
        registrantName: 'Maria Santos',
        status: 'PENDING',
        notes: null,
        fileUrl: 'https://example.com/doc2.pdf',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '3',
        title: 'Certidão de Nascimento',
        registrantName: 'Pedro Oliveira',
        status: 'REVIEWING',
        notes: 'Em análise pelo cartório',
        fileUrl: 'https://example.com/doc3.pdf',
        createdAt: '2024-01-15T10:00:00Z',
      }
    ],
  },
  {
    id: '2',
    name: 'Documentos Escolares',
    notes: 'Históricos e diplomas para validação internacional',
    status: 'COMPLETED',
    progress: 100,
    createdAt: '2024-01-20T14:30:00Z',
    documents: [
      {
        id: '4',
        title: 'Histórico Escolar',
        registrantName: 'Ana Costa',
        status: 'COMPLETED',
        notes: 'Apostilamento concluído',
        fileUrl: 'https://example.com/doc4.pdf',
        createdAt: '2024-01-20T14:30:00Z',
      },
      {
        id: '5',
        title: 'Diploma Universitário',
        registrantName: 'Carlos Ferreira',
        status: 'COMPLETED',
        notes: 'Apostilamento concluído',
        fileUrl: 'https://example.com/doc5.pdf',
        createdAt: '2024-01-20T14:30:00Z',
      }
    ],
  }
];

export default function ClientBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(EXAMPLE_BATCHES);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadBatch = async (formData: FormData) => {
    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload batch');
      
      toast.success("Lote enviado com sucesso");
      // Refresh batches
      // fetchBatches();
    } catch (error) {
      toast.error("Erro ao enviar lote");
    }
  };

  const getStatusIcon = (status: string) => {
    const iconProps = "h-5 w-5";
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className={iconProps} />;
      case 'PENDING':
        return <Clock className={iconProps} />;
      case 'PROCESSING':
        return <Clock className={iconProps} />;
      case 'REVIEWING':
        return <Clock className={iconProps} />;
      case 'REJECTED':
        return <AlertCircle className={iconProps} />;
      default:
        return null;
    }
  };

  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.documents.some(doc => 
      doc.registrantName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div className="flex justify-center items-center h-96">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Meus Lotes</h2>
        <div className="flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Enviar Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Novo Lote</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Lote</Label>
                  <Input placeholder="Ex: Certidões Janeiro 2024" />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea 
                    placeholder="Adicione observações importantes sobre os documentos..."
                    className="h-24"
                  />
                </div>
                <div>
                  <Label>Arquivo PDF</Label>
                  <div className="mt-2 flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Clique para selecionar ou arraste o arquivo
                        </p>
                      </div>
                      <Input type="file" accept=".pdf" className="hidden" />
                    </label>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredBatches.length === 0 && (
        <Alert>
          <AlertDescription>
            Nenhum lote encontrado.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {filteredBatches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{batch.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enviado em {new Date(batch.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Detalhes do Lote</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        readOnly
                        value={batch.notes || ''}
                        className="h-24 mt-2"
                      />
                    </div>
                    
                    <div className="border rounded-lg p-4 space-y-4">
                      <h4 className="font-medium">Documentos no Lote</h4>
                      <div className="space-y-2">
                        {batch.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium">{doc.title}</h4>
                                <p className="text-sm text-muted-foreground">{doc.registrantName}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Visualizar</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>Visualizar Documento</DialogTitle>
                                  </DialogHeader>
                                  <PDFViewer url={doc.fileUrl || ''} />
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Progresso</span>
                  <span>{batch.progress}%</span>
                </div>
                <Progress value={batch.progress} />
                
                <div className="border rounded-lg divide-y">
                  {batch.documents.map((doc) => (
                    <div key={doc.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">{doc.registrantName}</p>
                          {doc.notes && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{doc.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}