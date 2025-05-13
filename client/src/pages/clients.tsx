import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Header } from "@/components/header";
import { ClientTable } from "@/components/client-table";
import { CreateClientDialog } from "@/components/create-client-dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Clients() {
  const { toast } = useToast();
  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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

  // Update client mutation
  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest("PATCH", `/api/clients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao atualizar cliente: ${error.message}`,
      });
    },
  });

  // Filter clients based on active tab
  const filteredClients = clients.filter(client => {
    if (activeTab === "all") return true;
    if (activeTab === "leads") return client.funnelStage === "NOVO_LEAD" || client.funnelStage === "PRIMEIRO_CONTATO";
    if (activeTab === "recurring") return client.funnelStage === "POS_VENDA_RECORRENTE";
    if (activeTab === "inactive") return client.lastInteraction.includes("7 dias") || client.lastInteraction.includes("14 dias");
    return true;
  });

  // Handler functions for client actions
  const handleViewClient = (client: Client) => {
    toast({
      title: "Visualizar Cliente",
      description: `Visualizando perfil de ${client.name}`,
    });
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setEditClientOpen(true);
  };

  const handleContactWhatsApp = (client: Client) => {
    toast({
      title: "WhatsApp",
      description: `Iniciando conversa com ${client.name}`,
    });
  };

  const handleSchedule = (client: Client) => {
    toast({
      title: "Agendar",
      description: `Agendando consulta para ${client.name}`,
    });
  };

  return (
    <div className="p-6">
      <Header
        title="Gerenciamento de Clientes"
        subtitle="Visualize, adicione e gerencie sua base de clientes."
        actionLabel="Novo Cliente"
        actionIcon="fas fa-plus"
        onActionClick={() => setCreateClientOpen(true)}
      />

      {/* Client Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="border-b border-border w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
            >
              Todos os Clientes
            </TabsTrigger>
            <TabsTrigger
              value="leads"
              className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
            >
              Leads Ativos
            </TabsTrigger>
            <TabsTrigger
              value="recurring"
              className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
            >
              Clientes Recorrentes
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
            >
              Leads Inativos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0 p-0">
            <ClientTable
              clients={filteredClients}
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
              onContactWhatsApp={handleContactWhatsApp}
              onSchedule={handleSchedule}
            />
          </TabsContent>
          
          <TabsContent value="leads" className="mt-0 p-0">
            <ClientTable
              clients={filteredClients}
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
              onContactWhatsApp={handleContactWhatsApp}
              onSchedule={handleSchedule}
            />
          </TabsContent>
          
          <TabsContent value="recurring" className="mt-0 p-0">
            <ClientTable
              clients={filteredClients}
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
              onContactWhatsApp={handleContactWhatsApp}
              onSchedule={handleSchedule}
            />
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0 p-0">
            <ClientTable
              clients={filteredClients}
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
              onContactWhatsApp={handleContactWhatsApp}
              onSchedule={handleSchedule}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Client Dialog */}
      <CreateClientDialog
        open={createClientOpen}
        onOpenChange={setCreateClientOpen}
        onSubmit={(data) => {
          createClient.mutate(data);
        }}
      />

      {/* Edit Client Dialog */}
      {currentClient && (
        <CreateClientDialog
          open={editClientOpen}
          onOpenChange={setEditClientOpen}
          initialData={currentClient}
          isEditing={true}
          onSubmit={(data) => {
            updateClient.mutate({ id: currentClient.id, data });
          }}
        />
      )}
    </div>
  );
}
