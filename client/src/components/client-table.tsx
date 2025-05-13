import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Client, FunnelStage } from "@/lib/types";

interface ClientTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onContactWhatsApp: (client: Client) => void;
  onSchedule: (client: Client) => void;
}

export function ClientTable({
  clients,
  onViewClient,
  onEditClient,
  onContactWhatsApp,
  onSchedule,
}: ClientTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getBgForInitials = (initials: string) => {
    const colors = [
      "bg-primary/20 text-primary",
      "bg-secondary/20 text-secondary",
      "bg-accent/20 text-accent",
      "bg-destructive/20 text-destructive",
    ];
    
    // Simple hash function for the initials to get consistent colors
    const hash = initials.charCodeAt(0) + (initials.length > 1 ? initials.charCodeAt(1) : 0);
    return colors[hash % colors.length];
  };

  const getFunnelStageBadgeColor = (stage: FunnelStage) => {
    const colors = {
      "NOVO_LEAD": "bg-blue-500/20 text-blue-400",
      "PRIMEIRO_CONTATO": "bg-purple-500/20 text-purple-400",
      "AVALIACAO_AGENDADA": "bg-pink-500/20 text-pink-400",
      "PROCEDIMENTO_AGENDADO": "bg-orange-500/20 text-orange-400",
      "POS_VENDA_RECORRENTE": "bg-green-500/20 text-green-400",
    };
    return colors[stage] || "bg-gray-500/20 text-gray-400";
  };

  const getFunnelStageLabel = (stage: FunnelStage) => {
    const labels = {
      "NOVO_LEAD": "Novo Lead",
      "PRIMEIRO_CONTATO": "Primeiro Contato",
      "AVALIACAO_AGENDADA": "Avaliação Agendada",
      "PROCEDIMENTO_AGENDADO": "Procedimento Agendado",
      "POS_VENDA_RECORRENTE": "Cliente Recorrente",
    };
    return labels[stage] || stage;
  };

  // Calculate pagination
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const currentClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contato</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Interesse</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Última Interação</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-card divide-y divide-border">
            {currentClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={getBgForInitials(getInitials(client.name))}>
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{client.name}</div>
                      <div className="text-xs text-gray-400">{client.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="text-sm text-gray-300">{client.phone}</div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <i className="fab fa-whatsapp text-green-500 mr-1"></i> Ativo
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {client.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/20 text-primary border-primary/20">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={getFunnelStageBadgeColor(client.funnelStage)}>
                    {getFunnelStageLabel(client.funnelStage)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-300">
                  {client.lastInteraction}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onViewClient(client)}
                      className="text-primary hover:text-primary/80"
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEditClient(client)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onContactWhatsApp(client)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onSchedule(client)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-calendar-plus"></i>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-3 bg-muted border-t border-border flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Mostrando <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
          <span className="font-medium text-white">
            {Math.min(currentPage * itemsPerPage, clients.length)}
          </span>{" "}
          de <span className="font-medium text-white">{clients.length}</span> resultados
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-muted text-gray-400 border border-gray-700 hover:bg-muted"
          >
            Anterior
          </Button>
          
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={i + 1 === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className={i + 1 === currentPage ? "px-3 py-1 bg-primary/20 text-primary border border-primary/50" : "px-3 py-1 bg-muted text-gray-400 border border-gray-700 hover:bg-muted"}
            >
              {i + 1}
            </Button>
          ))}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-muted text-gray-400 border border-gray-700 hover:bg-muted"
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
