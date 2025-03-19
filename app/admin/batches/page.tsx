"use client"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, Clock } from "lucide-react"

export default function AdminBatchesPage() {
  const [selectedUser, setSelectedUser] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Lotes de Documentos</h2>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Selecionar Usuário/Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Empresa Master</SelectItem>
            <SelectItem value="2">Empresa Simplice Cidadania</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Lote 1</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Empresa Master</p>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
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
                  <div>
                    <h4 className="font-medium">Certidão de Nascimento</h4>
                    <p className="text-sm text-muted-foreground">Lais M. Fidelis</p>
                    <p className="text-xs text-muted-foreground">Obs: Urgente</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Certidão de Casamento</h4>
                    <p className="text-sm text-muted-foreground">Kayo Italo</p>
                  </div>
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}