import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FunnelCard } from "./funnel-card";
import { Client, FunnelStage } from "@/lib/types";

interface FunnelStageProps {
  stage: FunnelStage;
  clients: Client[];
  onClientClick: (client: Client) => void;
  onContactEmail: (client: Client) => void;
  onContactWhatsApp: (client: Client) => void;
}

export function FunnelStageComponent({
  stage,
  clients,
  onClientClick,
  onContactEmail,
  onContactWhatsApp,
}: FunnelStageProps) {
  const getStageName = (stage: FunnelStage) => {
    const stageMap = {
      NOVO_LEAD: "Novos Leads",
      PRIMEIRO_CONTATO: "Primeiro Contato",
      AVALIACAO_AGENDADA: "Avaliação Agendada",
      PROCEDIMENTO_AGENDADO: "Procedimento Agendado",
      POS_VENDA_RECORRENTE: "Pós-venda / Recorrente",
    };
    return stageMap[stage] || "Desconhecido";
  };

  const getStageColor = (stage: FunnelStage) => {
    const colorMap = {
      NOVO_LEAD: "blue-500",
      PRIMEIRO_CONTATO: "purple-500",
      AVALIACAO_AGENDADA: "pink-500",
      PROCEDIMENTO_AGENDADO: "orange-500",
      POS_VENDA_RECORRENTE: "green-500",
    };
    return colorMap[stage] || "gray-500";
  };

  const color = getStageColor(stage);

  return (
    <Card className="kanban-column bg-card shadow-md border border-border">
      <CardHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium text-white flex items-center text-base">
            <span className={`h-3 w-3 rounded-full bg-${color} mr-2`}></span>
            {getStageName(stage)}
          </CardTitle>
          <Badge variant="outline" className="text-xs px-2 py-1 rounded-full bg-background text-gray-300">
            {clients.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
        {clients.map((client) => (
          <FunnelCard
            key={client.id}
            client={client}
            onClick={() => onClientClick(client)}
            onContactEmail={() => onContactEmail(client)}
            onContactWhatsApp={() => onContactWhatsApp(client)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
