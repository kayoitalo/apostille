"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import {
  FileText,
  Upload,
  Eye,
  Circle,
  CheckCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminBatchesPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Implement batch creation logic here
      toast.success("Lote criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar lote");
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      // Implement batch deletion logic here
      toast.success("Lote excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir lote");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Lotes de Documentos</h2>
        <div className="flex gap-4">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecionar Usuário/Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Empresa Master</SelectItem>
              <SelectItem value="2">Empresa Simplice Cidadania</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Novo Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Lote</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <Label>Usuário/Empresa</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar Usuário/Empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Empresa Master</SelectItem>
                      <SelectItem value="2">Empresa Simplice Cidadania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nome do Lote</Label>
                  <Input placeholder="Ex: Certidões Janeiro 2024" required />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea 
                    placeholder="Adicione observações importantes..."
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
                      <Input type="file" accept=".pdf" className="hidden" required />
                    </label>
                  </div>
                </div>
                <Button type="submit" variant="outline" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Criar Lote
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Lote #123</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Empresa Master</p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Detalhes do Lote 1</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Observações do Cliente</Label>
                        <Textarea
                          readOnly
                          value="Documentos urgentes para apostilamento"
                          className="h-24"
                        />
                      </div>
                      <div>
                        <Label>Observações Internas</Label>
                        <Textarea
                          placeholder="Adicione observações internas..."
                          className="h-24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Adicionar Documentos</Label>
                      <div className="mt-2 flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Clique para selecionar ou arraste os arquivos
                            </p>
                          </div>
                          <Input type="file" multiple accept=".pdf" className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-4">
                      <h4 className="font-medium">Documentos no Lote</h4>
                      <div className="space-y-2">
                        {['Certidão de Nascimento.pdf', 'Certidão de Casamento.pdf'].map((doc) => (
                          <div key={doc} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{doc}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Visualizar</span>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remover</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remover documento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja remover este documento? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteBatch(doc)}>
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedBatch && (
                      <PDFViewer url="https://example.com/sample.pdf" />
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir lote</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteBatch("123")}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
              
              <div className="border rounded-lg divide-y">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Certidão de Nascimento</h4>
                      <p className="text-sm text-muted-foreground">Kayo Italo</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <AlertCircle className="h-3 w-3" />
                        <span>Urgente</span>
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5" />
                </div>
                
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Certidão de Casamento</h4>
                      <p className="text-sm text-muted-foreground">Laís M. Fidelis</p>
                    </div>
                  </div>
                  <Circle className="h-5 w-5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}