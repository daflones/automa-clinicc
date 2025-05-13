import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Procedure } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Procedures() {
  const { toast } = useToast();
  const [createProcedureOpen, setCreateProcedureOpen] = useState(false);

  // Fetch procedures data (mock para desenvolvimento)
  const proceduresMock: Procedure[] = [
    {
      id: "1",
      name: "Botox",
      description: "Aplicação de toxina botulínica para redução de rugas dinâmicas",
      duration: 30,
      price: 800
    },
    {
      id: "2",
      name: "Preenchimento Labial",
      description: "Aplicação de ácido hialurônico para volumização dos lábios",
      duration: 45,
      price: 1200
    },
    {
      id: "3",
      name: "Limpeza de Pele Profunda",
      description: "Procedimento de limpeza profunda com extração",
      duration: 60,
      price: 250
    },
    {
      id: "4",
      name: "Microagulhamento",
      description: "Estimulação de colágeno com pequenas agulhas",
      duration: 45,
      price: 450
    },
    {
      id: "5",
      name: "Peeling Químico",
      description: "Esfoliação química para renovação celular",
      duration: 30,
      price: 350
    }
  ];

  // Handler para cadastrar novo procedimento
  const handleNewProcedure = () => {
    setCreateProcedureOpen(true);
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O cadastro de procedimentos estará disponível em breve."
    });
  };

  // Handler para editar procedimento
  const handleEditProcedure = (procedure: Procedure) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do procedimento ${procedure.name} estará disponível em breve.`
    });
  };

  // Formatar preço para Reais
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Formatar duração
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
  };

  return (
    <div className="p-6">
      <Header
        title="Procedimentos"
        subtitle="Gerencie os procedimentos oferecidos pela clínica"
        actionLabel="Novo Procedimento"
        actionIcon="fas fa-plus"
        onActionClick={handleNewProcedure}
      />

      {/* Procedures Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">Lista de Procedimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left">Nome</TableHead>
                <TableHead className="text-left">Descrição</TableHead>
                <TableHead className="text-left">Duração</TableHead>
                <TableHead className="text-left">Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proceduresMock.map((procedure) => (
                <TableRow key={procedure.id} className="border-b border-border">
                  <TableCell className="font-medium text-white">{procedure.name}</TableCell>
                  <TableCell className="text-gray-300">{procedure.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {formatDuration(procedure.duration)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{formatPrice(procedure.price)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProcedure(procedure)}
                      className="text-primary hover:text-primary hover:bg-primary/20"
                    >
                      <i className="fas fa-edit mr-1"></i> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}