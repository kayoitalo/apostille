"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Eye,
  Upload,
  FileText,
  CheckCircle2,
  MessageSquare,
  Search,
  Circle,
  AlertCircle,
  DollarSign,
  FolderOpen,
  Languages,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentService } from "@/services/document.service";

const documentService = new DocumentService();

interface Service {
  id: string;
  code: string;
  name: string;
  fees: {
    type: string;
    value: number;
  }[];
}

interface Document {
  id: string;
  title: string;
  registrantName: string;
  status: 'PENDING' | 'REVIEWING' | 'COMPLETED' | 'REJECTED';
  notes: string | null;
  fileUrl: string | null;
  apostilledFileUrl: string | null;
  userId: string;
  batchId: string | null;
  batch?: {
    id: string;
    name: string;
    status: string;
    progress: number;
  };
  user: {
    name: string;
    company: string;
  };
  services?: Service[];
  totalFees?: number;
  createdAt: string;
  translationAssignment?: {
    id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    translator: {
      name: string;
    };
  };
}

interface Translator {
  id: string;
  name: string;
  email: string;
}

const EXAMPLE_SERVICES: Service[] = [
  {
    id: '1',
    code: 'Apostilamento',
    name: 'Apostilamento',
    fees: [
      { type: 'Emolumento', value: 1500.00 },
      { type: 'ISS', value: 200.50 },
      { type: 'CCRCPN', value: 130.50 },
    ]
  },
  {
    id: '2',
    code: 'Retificação',
    name: 'Retificação',
    fees: [
      { type: 'Emolumento', value: 880.00 },
      { type: 'ISS', value: 90.00 },
      { type: 'CCRCPN', value: 51.00 },
    ]
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [completionNotes, setCompletionNotes] = useState("");
  const [translators, setTranslators] = useState<Translator[]>([]);
  const [selectedTranslator, setSelectedTranslator] = useState("");

  useEffect(() => {
    fetchDocuments();
    fetchTranslators();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.findAll();
      setDocuments(data as Document[]);
    } catch (error) {
      toast.error("Erro ao carregar documentos");
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslators = async () => {
    try {
      const response = await fetch('/api/translators');
      if (!response.ok) throw new Error('Failed to fetch translators');
      const data = await response.json();
      setTranslators(data);
    } catch (error) {
      toast.error("Erro ao carregar tradutores");
    }
  };

  const userOptions = useMemo(() => {
    const uniqueUsers = Array.from(new Set(documents.map(doc => doc.userId)))
      .map(userId => {
        const doc = documents.find(d => d.userId === userId);
        return {
          value: userId,
          label: doc?.user.company || doc?.user.name || userId
        };
      })
      .filter(user => user.label);

    return [{ value: "all", label: "Todos" }, ...uniqueUsers];
  }, [documents]);

  const handleFileUpload = async (documentId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/documents/${documentId}/upload-apostilled`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      
      toast.success("Documento apostilado enviado com sucesso");
      fetchDocuments();
    } catch (error) {
      toast.error("Erro ao enviar documento");
    }
  };

  const calculateTotalFees = (services: string[]): number => {
    return services.reduce((total, serviceId) => {
      const service = EXAMPLE_SERVICES.find(s => s.id === serviceId);
      if (service) {
        return total + service.fees.reduce((sum, fee) => sum + fee.value, 0);
      }
      return total;
    }, 0);
  };

  const handleCompleteDocument = async (documentId: string) => {
    if (selectedServices.length === 0) {
      toast.error("Selecione pelo menos um serviço");
      return;
    }

    try {
      const totalFees = calculateTotalFees(selectedServices);
      
      const response = await fetch(`/api/documents/${documentId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notes: completionNotes,
          services: selectedServices,
          totalFees
        }),
      });

      if (!response.ok) throw new Error('Failed to complete document');
      
      toast.success("Documento concluído com sucesso");
      setSelectedServices([]);
      setCompletionNotes("");
      fetchDocuments();
    } catch (error) {
      toast.error("Erro ao concluir documento");
    }
  };

  const handleAssignTranslator = async (documentId: string) => {
    try {
      const response = await fetch('/api/translations/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          translatorId: selectedTranslator,
        }),
      });

      if (!response.ok) throw new Error('Failed to assign translator');
      
      toast.success("Documento enviado para tradução");
      setSelectedTranslator("");
      fetchDocuments();
    } catch (error) {
      toast.error("Erro ao enviar para tradução");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Circle className="h-5 w-5 text-yellow-500" />;
      case 'REVIEWING':
        return <Circle className="h-5 w-5 text-blue-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.registrantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = !selectedUser || selectedUser === "all" || doc.userId === selectedUser;
    return matchesSearch && matchesUser;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-96">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
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
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filtrar por Usuário/Empresa" />
            </SelectTrigger>
            <SelectContent>
              {userOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <p className="text-xs text-muted-foreground">
                  {document.user.company || document.user.name}
                </p>
                {document.batch && (
                  <div className="flex items-center gap-2 mt-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Lote: {document.batch.name}
                    </span>
                  </div>
                )}
                {document.translationAssignment && (
                  <div className="flex items-center gap-2 mt-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Tradutor: {document.translationAssignment.translator.name} ({document.translationAssignment.status})
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Apostilado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enviar Documento Apostilado</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Arquivo PDF</Label>
                        <Input 
                          type="file" 
                          accept=".pdf" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(document.id, file);
                          }}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Languages className="mr-2 h-4 w-4" />
                      Enviar para Tradução
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enviar para Tradução</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Selecionar Tradutor</Label>
                        <Select
                          value={selectedTranslator}
                          onValueChange={setSelectedTranslator}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha um tradutor" />
                          </SelectTrigger>
                          <SelectContent>
                            {translators.map((translator) => (
                              <SelectItem key={translator.id} value={translator.id}>
                                {translator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAssignTranslator(document.id)}
                        disabled={!selectedTranslator}
                      >
                        Enviar para Tradução
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Concluir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Concluir Documento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Serviços Aplicados</Label>
                        <div className="space-y-2 mt-2">
                          {EXAMPLE_SERVICES.map(service => (
                            <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <div className="text-sm text-muted-foreground">
                                  {service.fees.map(fee => (
                                    <div key={fee.type}>
                                      {fee.type}: R$ {fee.value.toFixed(2)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant={selectedServices.includes(service.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setSelectedServices(prev => 
                                    prev.includes(service.id)
                                      ? prev.filter(id => id !== service.id)
                                      : [...prev, service.id]
                                  );
                                }}
                              >
                                {selectedServices.includes(service.id) ? "Selecionado" : "Selecionar"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedServices.length > 0 && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Total:</span>
                            <span className="text-xl font-bold">
                              R$ {calculateTotalFees(selectedServices).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Observações</Label>
                        <Textarea 
                          value={completionNotes}
                          onChange={(e) => setCompletionNotes(e.target.value)}
                          placeholder="Adicione observações sobre a conclusão..."
                          className="h-24"
                        />
                      </div>

                      <DialogFooter>
                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleCompleteDocument(document.id)}
                          disabled={selectedServices.length === 0}
                        >
                          <DollarSign className="h-4 w-4" />
                          Concluir e Gerar Custas
                        </Button>
                      </DialogFooter>
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
                {document.totalFees && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Valor Total: R$ {document.totalFees.toFixed(2)}</span>
                  </div>
                )}
                {document.notes && (
                  <div className="flex items-start gap-2 mt-4 p-3 bg-muted rounded-lg">
                    <MessageSquare className="h-4 w-4 mt-0.5" />
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