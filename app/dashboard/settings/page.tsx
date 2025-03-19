"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  documentNumber: string;
  role: string;
  isActive: boolean;
}

interface Service {
  id: string;
  code: string;
  name: string;
  fees: {
    type: string;
    value: number;
  }[];
}

const FEE_TYPES = ['emolumento', 'iss', 'ccrcpn'] as const;
type FeeType = typeof FEE_TYPES[number];

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [currentFeeType, setCurrentFeeType] = useState<FeeType>("emolumento");
  const [newService, setNewService] = useState({
    code: "",
    name: "",
    fees: [] as { type: FeeType; value: number }[],
  });
  const [currentFeeValue, setCurrentFeeValue] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchServices();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar serviços");
    }
  };

  const handleUserStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update user status');
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
      
      toast.success("Status do usuário atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar status do usuário");
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          documentType: formData.get("documentType"),
          documentNumber: formData.get("documentNumber"),
          role: formData.get("role"),
          isActive: formData.get("isActive") === "true",
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');

      const newUser = await response.json();
      setUsers([...users, newUser]);
      toast.success("Usuário criado com sucesso");
      setIsEditingUser(false);
      setEditingUserId(null);
    } catch (error) {
      toast.error("Erro ao criar usuário");
    }
  };

  const handleEditUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const user = await response.json();
      setIsEditingUser(true);
      setEditingUserId(userId);
    } catch (error) {
      toast.error("Erro ao carregar dados do usuário");
    }
  };

  const handleAddFee = () => {
    if (!currentFeeValue || isNaN(parseFloat(currentFeeValue))) {
      toast.error("Por favor, insira um valor válido");
      return;
    }

    const value = parseFloat(currentFeeValue);
    setNewService(prev => ({
      ...prev,
      fees: [...prev.fees, { type: currentFeeType, value }],
    }));

    setCurrentFeeValue("");

    const nextFeeTypeIndex = FEE_TYPES.indexOf(currentFeeType) + 1;
    if (nextFeeTypeIndex < FEE_TYPES.length) {
      setCurrentFeeType(FEE_TYPES[nextFeeTypeIndex]);
    } else {
      handleCreateService();
    }
  };

  const handleCreateService = async () => {
    if (newService.fees.length !== FEE_TYPES.length) {
      return; // Don't create service until all fees are added
    }

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      if (!response.ok) throw new Error('Failed to create service');

      const createdService = await response.json();
      setServices([...services, createdService]);
      toast.success("Serviço criado com sucesso");
      
      // Reset form
      setNewService({
        code: "",
        name: "",
        fees: [],
      });
      setCurrentFeeType("emolumento");
      setCurrentFeeValue("");
    } catch (error) {
      toast.error("Erro ao criar serviço");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="fees">Tarifas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Usuários do Sistema</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {isEditingUser ? "Editar Usuário" : "Criar Novo Usuário"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label>Tipo de Documento</Label>
                        <Select name="documentType" value={documentType} onValueChange={(value) => setDocumentType(value as "cpf" | "cnpj")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="cnpj">CNPJ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="documentNumber">
                          {documentType === "cpf" ? "CPF" : "CNPJ"}
                        </Label>
                        <Input
                          id="documentNumber"
                          name="documentNumber"
                          required
                          placeholder={
                            documentType === "cpf"
                              ? "000.000.000-00"
                              : "00.000.000/0000-00"
                          }
                        />
                      </div>
                      <div>
                        <Label>Permissão</Label>
                        <Select name="role" defaultValue="CLIENT">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a permissão" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                            <SelectItem value="CLIENT">Cliente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="isActive" name="isActive" defaultChecked />
                        <Label htmlFor="isActive">Usuário Ativo</Label>
                      </div>
                      <Button type="submit" className="w-full">
                        {isEditingUser ? "Salvar Alterações" : "Criar Usuário"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.documentNumber}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={user.isActive}
                          onCheckedChange={(checked) => handleUserStatusChange(user.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Criar Serviço</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código do Serviço</Label>
                  <Input 
                    placeholder="IV.2.A" 
                    value={newService.code}
                    onChange={(e) => setNewService(prev => ({
                      ...prev,
                      code: e.target.value
                    }))}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Serviço</Label>
                  <Input 
                    placeholder="Ex: Apostilamento" 
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    required 
                  />
                </div>
              </div>
              
              {newService.fees.length < FEE_TYPES.length && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">Tarifa: {currentFeeType}</h4>
                    <span className="text-sm text-muted-foreground">
                      {newService.fees.length + 1}/{FEE_TYPES.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0,00"
                        value={currentFeeValue}
                        onChange={(e) => setCurrentFeeValue(e.target.value)}
                        required 
                      />
                      <Button onClick={handleAddFee}>
                        {newService.fees.length === FEE_TYPES.length - 1 ? "Salvar Serviço" : "Próxima Tarifa"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Emolumento</TableHead>
                    <TableHead>ISS</TableHead>
                    <TableHead>CCRCPN</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map(service => (
                    <TableRow key={service.id}>
                      <TableCell>{service.code}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        R$ {service.fees.find(f => f.type === 'emolumento')?.value.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        R$ {service.fees.find(f => f.type === 'iss')?.value.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        R$ {service.fees.find(f => f.type === 'ccrcpn')?.value.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        R$ {service.fees.reduce((sum, fee) => sum + fee.value, 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Tarifas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.flatMap(service =>
                    service.fees.map((fee, index) => (
                      <TableRow key={`${service.id}-${index}`}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell className="capitalize">{fee.type}</TableCell>
                        <TableCell>R$ {fee.value.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}