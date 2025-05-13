import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client, FunnelStage } from "@/lib/types";

interface FunnelCardProps {
  client: Client;
  onClick: () => void;
  onContactEmail: () => void;
  onContactWhatsApp: () => void;
}

export function FunnelCard({
  client,
  onClick,
  onContactEmail,
  onContactWhatsApp,
}: FunnelCardProps) {
  const getStatusBadge = (stage: FunnelStage) => {
    const statusMap = {
      NOVO_LEAD: {
        color: "bg-blue-500/20 text-blue-400",
        label: "Novo",
      },
      PRIMEIRO_CONTATO: {
        color: "bg-purple-500/20 text-purple-400",
        label: "Contatado",
      },
      AVALIACAO_AGENDADA: {
        color: "bg-pink-500/20 text-pink-400",
        label: "Avaliação",
      },
      PROCEDIMENTO_AGENDADO: {
        color: "bg-orange-500/20 text-orange-400",
        label: "Agendado",
      },
      POS_VENDA_RECORRENTE: {
        color: "bg-green-500/20 text-green-400",
        label: "Recorrente",
      },
    };
    return statusMap[stage] || { color: "bg-gray-500/20 text-gray-400", label: "Desconhecido" };
  };

  const status = getStatusBadge(client.funnelStage);

  return (
    <Card
      className="funnel-stage bg-muted p-3 border border-border shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-white">{client.name}</h4>
          <Badge className={`px-1.5 py-0.5 text-xs rounded-full ${status.color}`}>
            {status.label}
          </Badge>
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <i className="fas fa-spa mr-1"></i>
          <span>{client.interests.join(", ")}</span>
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <i className="fas fa-phone-alt mr-1"></i>
          <span>{client.phone}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-xs text-gray-500">{client.lastInteraction}</span>
          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onContactEmail();
              }}
              className="p-1 text-gray-400 hover:text-white h-auto w-auto"
            >
              <i className="fas fa-envelope text-xs"></i>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onContactWhatsApp();
              }}
              className="p-1 text-gray-400 hover:text-white h-auto w-auto"
            >
              <i className="fab fa-whatsapp text-xs"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
