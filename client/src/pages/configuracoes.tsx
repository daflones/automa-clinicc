import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("geral");
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesWhatsApp, setNotificacoesWhatsApp] = useState(true);
  const [notificacoesNovoLead, setNotificacoesNovoLead] = useState(true);
  const [notificacoesAgendamento, setNotificacoesAgendamento] = useState(true);
  
  const handleSaveGeneral = () => {
    toast({
      title: "Configurações gerais salvas",
      description: "As alterações foram salvas com sucesso.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Configurações de notificações salvas",
      description: "As preferências de notificações foram atualizadas.",
    });
  };
  
  const handleSaveIntegrations = () => {
    toast({
      title: "Configurações de integrações salvas",
      description: "As configurações de integrações foram atualizadas.",
    });
  };

  return (
    <div className="p-6">
      <Header
        title="Configurações"
        subtitle="Gerencie as configurações do sistema."
      />

      <Tabs defaultValue="geral" onValueChange={setActiveTab} className="mt-6">
        <TabsList className="border-b border-border w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger
            value="geral"
            className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger
            value="notificacoes"
            className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
          >
            Notificações
          </TabsTrigger>
          <TabsTrigger
            value="integracoes"
            className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
          >
            Integrações
          </TabsTrigger>
          <TabsTrigger
            value="usuarios"
            className="data-[state=active]:text-primary data-[state=active]:border-primary px-4 py-2 data-[state=active]:border-b-2 border-b-2 border-transparent rounded-none text-sm font-medium"
          >
            Usuários
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Content: Geral */}
        <TabsContent value="geral" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeClinica">Nome da Clínica</Label>
                  <Input id="nomeClinica" defaultValue="AutomaClinic.ia" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" defaultValue="Rua Exemplo, 123 - São Paulo, SP" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone para Contato</Label>
                  <Input id="telefone" defaultValue="(11) 98765-4321" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email para Contato</Label>
                  <Input id="email" defaultValue="contato@automaclinic.ia" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Tema Escuro</Label>
                    <p className="text-sm text-muted-foreground">Ativar o tema escuro no sistema.</p>
                  </div>
                  <Switch id="temaEscuro" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Modo Compacto</Label>
                    <p className="text-sm text-muted-foreground">Reduzir o espaçamento entre elementos.</p>
                  </div>
                  <Switch id="modoCompacto" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral}>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Content: Notificações */}
        <TabsContent value="notificacoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canais de Notificação</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas por email.</p>
                  </div>
                  <Switch 
                    id="notificacoesEmail" 
                    checked={notificacoesEmail}
                    onCheckedChange={setNotificacoesEmail}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificações por WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas por WhatsApp.</p>
                  </div>
                  <Switch 
                    id="notificacoesWhatsApp" 
                    checked={notificacoesWhatsApp}
                    onCheckedChange={setNotificacoesWhatsApp}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Eventos</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Novos Leads</Label>
                    <p className="text-sm text-muted-foreground">Ser notificado quando novos leads forem cadastrados.</p>
                  </div>
                  <Switch 
                    id="notificacoesNovoLead" 
                    checked={notificacoesNovoLead}
                    onCheckedChange={setNotificacoesNovoLead}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Agendamentos</Label>
                    <p className="text-sm text-muted-foreground">Ser notificado sobre novos agendamentos e alterações.</p>
                  </div>
                  <Switch 
                    id="notificacoesAgendamento" 
                    checked={notificacoesAgendamento}
                    onCheckedChange={setNotificacoesAgendamento}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Content: Integrações */}
        <TabsContent value="integracoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-base font-medium">WhatsApp Business API</h4>
                      <p className="text-sm text-muted-foreground">Conecte com o WhatsApp Business para envio automatizado de mensagens.</p>
                    </div>
                    <Switch id="whatsappIntegration" defaultChecked />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="whatsappToken">Token de Acesso</Label>
                    <Input id="whatsappToken" type="password" defaultValue="●●●●●●●●●●●●●●●●●●" />
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-base font-medium">Google Calendar</h4>
                      <p className="text-sm text-muted-foreground">Sincronize agendamentos com o Google Calendar.</p>
                    </div>
                    <Switch id="googleCalendarIntegration" defaultChecked={false} />
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">Conectar com Google Calendar</Button>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-base font-medium">Gateway de Pagamento</h4>
                      <p className="text-sm text-muted-foreground">Integração com sistema de pagamentos online.</p>
                    </div>
                    <Switch id="paymentIntegration" defaultChecked={false} />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="paymentProvider">Provedor</Label>
                    <select id="paymentProvider" className="w-full rounded-md border border-input bg-transparent px-3 py-2">
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="mercadopago">MercadoPago</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveIntegrations}>Salvar Integrações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Content: Usuários */}
        <TabsContent value="usuarios" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Usuários do Sistema</CardTitle>
              <Button size="sm">
                <i className="fas fa-plus mr-2"></i>
                Adicionar Usuário
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Administrador</p>
                        <p className="text-sm text-muted-foreground">admin@automaclinic.ia</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full mr-4">
                        Administrador
                      </span>
                      <Button variant="ghost" size="icon">
                        <i className="fas fa-ellipsis-v"></i>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        M
                      </div>
                      <div>
                        <p className="font-medium">Maria Oliveira</p>
                        <p className="text-sm text-muted-foreground">maria@automaclinic.ia</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-purple-500/20 text-purple-500 text-xs px-2 py-1 rounded-full mr-4">
                        Secretária
                      </span>
                      <Button variant="ghost" size="icon">
                        <i className="fas fa-ellipsis-v"></i>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        J
                      </div>
                      <div>
                        <p className="font-medium">João Silva</p>
                        <p className="text-sm text-muted-foreground">joao@automaclinic.ia</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded-full mr-4">
                        Profissional
                      </span>
                      <Button variant="ghost" size="icon">
                        <i className="fas fa-ellipsis-v"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}