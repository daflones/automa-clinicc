import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartPlaceholder } from "@/components/chart-placeholder";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState("pacientes");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Dados de exemplo para gráficos
  const patientsPerMonthData = [
    { name: "Jan", valor: 12 },
    { name: "Fev", valor: 18 },
    { name: "Mar", valor: 15 },
    { name: "Abr", valor: 22 },
    { name: "Mai", valor: 28 },
    { name: "Jun", valor: 32 },
    { name: "Jul", valor: 38 },
    { name: "Ago", valor: 36 },
    { name: "Set", valor: 42 },
    { name: "Out", valor: 48 },
    { name: "Nov", valor: 52 },
    { name: "Dez", valor: 58 },
  ];

  const revenueData = [
    { name: "Jan", valor: 8500 },
    { name: "Fev", valor: 12300 },
    { name: "Mar", valor: 15600 },
    { name: "Abr", valor: 18900 },
    { name: "Mai", valor: 22500 },
    { name: "Jun", valor: 26800 },
    { name: "Jul", valor: 29200 },
    { name: "Ago", valor: 31500 },
    { name: "Set", valor: 35800 },
    { name: "Out", valor: 42300 },
    { name: "Nov", valor: 48700 },
    { name: "Dez", valor: 56200 },
  ];

  const proceduresData = [
    { name: "Botox", valor: 85 },
    { name: "Preenchimento", valor: 68 },
    { name: "Limpeza de Pele", valor: 120 },
    { name: "Peeling", valor: 45 },
    { name: "Microagulhamento", valor: 32 },
  ];

  const funnelData = [
    { name: "Novos Leads", valor: 120 },
    { name: "Primeiro Contato", valor: 95 },
    { name: "Avaliação", valor: 72 },
    { name: "Procedimento", valor: 48 },
    { name: "Pós-venda", valor: 36 },
  ];

  // Funções para renderizar relatórios específicos
  const renderPatientsReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartPlaceholder
        title="Novos Pacientes por Mês"
        chartType="bar"
        data={patientsPerMonthData}
        height={350}
      />
      <ChartPlaceholder
        title="Distribuição de Procedimentos"
        chartType="pie"
        data={proceduresData}
        height={350}
      />
    </div>
  );

  const renderRevenueReport = () => (
    <div className="grid grid-cols-1 gap-6">
      <ChartPlaceholder
        title="Faturamento Mensal (R$)"
        chartType="line"
        data={revenueData}
        height={350}
      />
    </div>
  );

  const renderFunnelReport = () => (
    <div className="grid grid-cols-1 gap-6">
      <ChartPlaceholder
        title="Funil de Vendas"
        chartType="funnel"
        data={funnelData}
        height={400}
      />
    </div>
  );

  // Renderização condicional com base no tipo de relatório selecionado
  const renderSelectedReport = () => {
    switch (selectedReport) {
      case "pacientes":
        return renderPatientsReport();
      case "faturamento":
        return renderRevenueReport();
      case "funil":
        return renderFunnelReport();
      default:
        return <p className="text-center text-gray-400">Selecione um relatório para visualizar</p>;
    }
  };

  // Handler para exportar relatório
  const handleExportReport = () => {
    toast({
      title: "Exportação de relatório",
      description: "A exportação de relatórios estará disponível em breve."
    });
  };

  return (
    <div className="p-6">
      <Header
        title="Relatórios"
        subtitle="Visualize dados e métricas da clínica"
        actionLabel="Exportar PDF"
        actionIcon="fas fa-download"
        onActionClick={handleExportReport}
      />

      {/* Filtros de relatório */}
      <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Tipo de Relatório
            </label>
            <Select defaultValue={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-full bg-muted border border-border">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pacientes">Pacientes</SelectItem>
                <SelectItem value="faturamento">Faturamento</SelectItem>
                <SelectItem value="funil">Funil de Vendas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Período
            </label>
            <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full bg-muted border border-border">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button className="w-full">
              <i className="fas fa-filter mr-2"></i>
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do relatório */}
      <div className="mt-6">
        {renderSelectedReport()}
      </div>
    </div>
  );
}