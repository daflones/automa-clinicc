import { Client } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ViewClientDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactWhatsApp: (client: Client) => void;
  onEditClient: (client: Client) => void;
}

export function ViewClientDialog({
  client,
  open,
  onOpenChange,
  onContactWhatsApp,
  onEditClient,
}: ViewClientDialogProps) {
  if (!client) return null;

  const getFunnelStageLabel = (stage: string) => {
    const stageMap: Record<string, string> = {
      NOVO_LEAD: "Novo Lead",
      PRIMEIRO_CONTATO: "Primeiro Contato",
      AVALIACAO_AGENDADA: "Avaliação Agendada",
      PROCEDIMENTO_AGENDADO: "Procedimento Agendado",
      POS_VENDA_RECORRENTE: "Pós-venda / Recorrente",
    };
    return stageMap[stage] || stage;
  };

  const getFunnelStageBadgeColor = (stage: string) => {
    const colorMap: Record<string, string> = {
      NOVO_LEAD: "bg-blue-500/20 text-blue-400",
      PRIMEIRO_CONTATO: "bg-purple-500/20 text-purple-400",
      AVALIACAO_AGENDADA: "bg-pink-500/20 text-pink-400",
      PROCEDIMENTO_AGENDADO: "bg-orange-500/20 text-orange-400",
      POS_VENDA_RECORRENTE: "bg-green-500/20 text-green-400",
    };
    return colorMap[stage] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{client.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge className={`${getFunnelStageBadgeColor(client.funnelStage)}`}>
              {getFunnelStageLabel(client.funnelStage)}
            </Badge>
            <span className="text-sm text-muted-foreground">Última interação: {client.lastInteraction}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Contato</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center">
                <i className="fas fa-envelope text-gray-400 w-5 h-5 mr-2"></i>
                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                  {client.email}
                </a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gray-400 w-5 h-5 mr-2"></i>
                <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                  {client.phone}
                </a>
              </div>
              {client.cpf && (
                <div className="flex items-center">
                  <i className="fas fa-id-card text-gray-400 w-5 h-5 mr-2"></i>
                  <span>{client.cpf}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Interesses</h3>
            <div className="flex flex-wrap gap-1">
              {client.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {client.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações</h3>
                <p className="text-sm">{client.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => onContactWhatsApp(client)}
              className="flex items-center gap-2"
            >
              <i className="fab fa-whatsapp text-green-500"></i>
              Contatar via WhatsApp
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onEditClient(client)}
              className="flex items-center gap-2"
            >
              <i className="fas fa-edit"></i>
              Editar Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}