"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Files,
  FolderOpen,
  Clock,
  CheckCircle2,
  DollarSign,
  BarChart3,
} from "lucide-react";
// Importing chart components from shadcn/ui
import { Bar } from "@/components/ui/chart";
interface CompanyStats {
  id: string;
  name: string;
  totalDocuments: number;
  completedDocuments: number;
  pendingDocuments: number;
  totalRevenue: number;
  serviceBreakdown: {
    name: string;
    count: number;
    revenue: number;
  }[];
}
const EXAMPLE_STATS: CompanyStats[] = [
  {
    id: "1",
    name: "Empresa Master",
    totalDocuments: 25,
    completedDocuments: 13,
    pendingDocuments: 12,
    totalRevenue: 5250.00,
    serviceBreakdown: [
      { name: "Pedido de Certidão", count: 8, revenue: 1600.00 },
      { name: "Retificação", count: 5, revenue: 1000.00 },
      { name: "Apostilamento", count: 12, revenue: 2650.00 },
    ]
  },
  {
    id: "2",
    name: "Empresa Simplice Cidadania",
    totalDocuments: 18,
    completedDocuments: 15,
    pendingDocuments: 3,
    totalRevenue: 3750.00,
    serviceBreakdown: [
      { name: "Pedido de Certidão", count: 6, revenue: 1200.00 },
      { name: "Retificação", count: 4, revenue: 800.00 },
      { name: "Apostilamento", count: 8, revenue: 1750.00 },
    ]
  }
];
export default function DashboardPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const stats = selectedCompany
    ? EXAMPLE_STATS.find(s => s.id === selectedCompany)
    : EXAMPLE_STATS[0];
  const chartData = stats ? {
    labels: stats.serviceBreakdown.map(s => s.name),
    datasets: [
      {
        label: 'Quantidade',
        data: stats.serviceBreakdown.map(s => s.count),
        backgroundColor: 'hsl(var(--muted))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
      {
        label: 'Receita (R$)',
        data: stats.serviceBreakdown.map(s => s.revenue),
        backgroundColor: 'hsl(var(--accent))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      }
    ]
  } : { labels: [], datasets: [] };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Selecionar Empresa" />
          </SelectTrigger>
          <SelectContent>
            {EXAMPLE_STATS.map(company => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Documentos
            </CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDocuments ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Concluídos
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedDocuments ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Processamento
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingDocuments ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.totalRevenue.toFixed(2) ?? "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Serviços por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.serviceBreakdown.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.count} documentos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {service.revenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Média: R$ {(service.revenue / service.count).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}