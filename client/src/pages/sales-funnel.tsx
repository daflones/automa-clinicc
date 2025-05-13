import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { FunnelStageComponent } from "@/components/funnel-stage";
import { apiRequest } from "@/lib/queryClient";
import { CreateClientDialog } from "@/components/create-client-dialog";
import { useToast } from "@/hooks/use-toast";
import { Client, FunnelStage } from "@/lib/types";

export default function SalesFunnel() {
  const { toast } = useToast();
  const [createClientOpen, setCreateClientOpen] = useState(false);

  // Fetch clients data
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Create client mutation
  const createClient = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/clients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Cliente adicionado",
        description: "O novo cliente foi adicionado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao adicionar cliente: ${error.message}`,
      });
    },
  });

  const stages: FunnelStage[] = [
    "NOVO_LEAD",
    "PRIMEIRO_CONTATO",
    "AVALIACAO_AGENDADA",
    "PROCEDIMENTO_AGENDADO",
    "POS_VENDA_RECORRENTE"
  ];
  
  // Filter clients by funnel stage
  const clientsByStage = (stage: FunnelStage) => {
    return clients.filter(client => client.funnelStage === stage);
  };

  // Helper functions for client actions
  const handleClientClick = (client: Client) => {
    toast({
      title: "Detalhes do cliente",
      description: `Visualizando detalhes de ${client.name}`,
    });
  };

  const handleContactEmail = (client: Client) => {
    toast({
      title: "Email",
      description: `Enviando email para ${client.name}`,
    });
  };

  const handleContactWhatsApp = (client: Client) => {
    // Formatar o número de telefone (remover caracteres não numéricos)
    const phoneNumber = client.phone.replace(/\D/g, '');
    
    // Adicionar o código do país se não estiver presente (Brasil)
    const formattedNumber = phoneNumber.startsWith('55') ? phoneNumber : `55${phoneNumber}`;
    
    // Criar URL do WhatsApp e abrir em nova janela
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=Olá ${encodeURIComponent(client.name)}, tudo bem?`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp",
      description: `Enviando mensagem de WhatsApp para ${client.name}`,
    });
  };

  // Calculate stats for each stage
  const getStagePercentChange = (stage: FunnelStage) => {
    // In a real app, this would come from the API with actual comparison data
    const changes = {
      NOVO_LEAD: 8,
      PRIMEIRO_CONTATO: 5,
      AVALIACAO_AGENDADA: -3,
      PROCEDIMENTO_AGENDADO: 12,
      POS_VENDA_RECORRENTE: 15,
    };
    return changes[stage];
  };

  return (
    <div className="p-6">
      <Header
        title="Funil de Vendas"
        subtitle="Visualize e gerencie o progresso dos seus leads e clientes."
        actionLabel="Novo Lead"
        actionIcon="fas fa-plus"
        onActionClick={() => setCreateClientOpen(true)}
      />

      {/* Funnel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stages.map((stage) => {
          const count = clientsByStage(stage).length;
          const percentChange = getStagePercentChange(stage);
          
          return (
            <StatCard
              key={stage}
              title={
                stage === "NOVO_LEAD" ? "Novos Leads" :
                stage === "PRIMEIRO_CONTATO" ? "Primeiro Contato" :
                stage === "AVALIACAO_AGENDADA" ? "Avaliação Agendada" :
                stage === "PROCEDIMENTO_AGENDADO" ? "Procedimento Agendado" :
                "Pós-venda / Recorrente"
              }
              value={count.toString()}
              icon={
                stage === "NOVO_LEAD" ? "fas fa-user-plus" :
                stage === "PRIMEIRO_CONTATO" ? "fas fa-phone-alt" :
                stage === "AVALIACAO_AGENDADA" ? "fas fa-clipboard-check" :
                stage === "PROCEDIMENTO_AGENDADO" ? "fas fa-calendar-check" :
                "fas fa-redo"
              }
              change={{ value: `${Math.abs(percentChange)}%`, positive: percentChange >= 0 }}
            />
          );
        })}
      </div>

      {/* Funnel Visualization */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-6 min-w-max">
          {stages.map((stage) => (
            <FunnelStageComponent
              key={stage}
              stage={stage}
              clients={clientsByStage(stage)}
              onClientClick={handleClientClick}
              onContactEmail={handleContactEmail}
              onContactWhatsApp={handleContactWhatsApp}
            />
          ))}
        </div>
      </div>

      {/* Create Client Dialog */}
      <CreateClientDialog
        open={createClientOpen}
        onOpenChange={setCreateClientOpen}
        onSubmit={(data) => {
          createClient.mutate(data);
        }}
      />
    </div>
  );
}
