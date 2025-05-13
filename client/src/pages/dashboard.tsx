import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { NotificationCard } from "@/components/notification-card";
import { ChartPlaceholder } from "@/components/chart-placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Client, Notification, Appointment } from "@/lib/types";

export default function Dashboard() {
  const { toast } = useToast();
  const [chartPeriod, setChartPeriod] = useState("Esta Semana");

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  // Mock data while waiting for API implementation
  const barChartData = [
    { name: "Seg", valor: 4 },
    { name: "Ter", valor: 6 },
    { name: "Qua", valor: 3 },
    { name: "Qui", valor: 8 },
    { name: "Sex", valor: 5 },
    { name: "Sáb", valor: 2 },
    { name: "Dom", valor: 0 },
  ];

  const funnelData = [
    { name: "Novos Leads", valor: 42 },
    { name: "Primeiro Contato", valor: 35 },
    { name: "Avaliação Agendada", valor: 24 },
    { name: "Procedimento Agendado", valor: 18 },
    { name: "Pós-venda", valor: 31 },
  ];

  const todayAppointments = [
    {
      id: "1",
      clientName: "Maria Silva",
      clientInitials: "MS",
      initalsColor: "bg-primary/20 text-primary",
      time: "09:00 - 10:30",
      procedure: "Botox",
      status: "Confirmado",
      statusColor: "bg-green-500/20 text-green-500",
    },
    {
      id: "2",
      clientName: "João Pereira",
      clientInitials: "JP",
      initalsColor: "bg-secondary/20 text-secondary",
      time: "11:00 - 12:00",
      procedure: "Avaliação Facial",
      status: "A Confirmar",
      statusColor: "bg-amber-500/20 text-amber-500",
    },
    {
      id: "3",
      clientName: "Ana Costa",
      clientInitials: "AC",
      initalsColor: "bg-accent/20 text-accent",
      time: "14:30 - 15:30",
      procedure: "Preenchimento Labial",
      status: "Confirmado",
      statusColor: "bg-green-500/20 text-green-500",
    },
    {
      id: "4",
      clientName: "Roberto Santos",
      clientInitials: "RS",
      initalsColor: "bg-destructive/20 text-destructive",
      time: "16:00 - 17:00",
      procedure: "Microagulhamento",
      status: "Confirmado",
      statusColor: "bg-green-500/20 text-green-500",
    },
  ];

  const notifications = [
    {
      id: "1",
      icon: "fas fa-calendar-alt",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary",
      title: "Lembrete: 3 Consultas amanhã",
      description: "Verifique a agenda para mais detalhes",
      time: "Há 10 minutos",
      actionLabel: "Ver Agenda",
      onActionClick: () => toast({
        title: "Redirecionando para agenda",
        description: "Você será redirecionado para a página de agenda."
      }),
    },
    {
      id: "2",
      icon: "fas fa-user-clock",
      iconBgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
      title: "Lead inativo: Carolina Mendes",
      description: "Sem interação há 7 dias",
      time: "Há 2 horas",
      actionLabel: "Programar Contato",
      onActionClick: () => toast({
        title: "Contato programado",
        description: "Um lembrete foi adicionado à sua lista de tarefas."
      }),
    },
    {
      id: "3",
      icon: "fas fa-check-circle",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      title: "Procedimento concluído: Maria Silva",
      description: "Botox aplicado com sucesso",
      time: "Há 5 horas",
      actionLabel: "Agendar Retorno",
      onActionClick: () => toast({
        title: "Agendar retorno",
        description: "Você será redirecionado para o agendamento de retorno."
      }),
    },
    {
      id: "4",
      icon: "fas fa-exclamation-circle",
      iconBgColor: "bg-destructive/20",
      iconColor: "text-destructive",
      title: "Consulta cancelada: João Pereira",
      description: "Reagendar para a próxima semana",
      time: "Há 6 horas",
      actionLabel: "Reagendar",
      onActionClick: () => toast({
        title: "Reagendamento",
        description: "Você será redirecionado para reagendar a consulta."
      }),
    },
  ];

  return (
    <div className="p-6">
      <Header
        title="Dashboard"
        subtitle="Bem-vinda, Dra. Amanda. Aqui está o resumo da sua clínica."
        actionLabel="Nova Tarefa"
        actionIcon="fas fa-plus"
        onActionClick={() => {
          toast({
            title: "Nova tarefa",
            description: "Função de criar novas tarefas em desenvolvimento."
          });
        }}
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Consultas Hoje"
          value="8"
          icon="fas fa-calendar-check"
          change={{ value: "12%", positive: true }}
          changeText="em relação à semana anterior"
        />
        <StatCard
          title="Novos Leads"
          value="24"
          icon="fas fa-user-plus"
          iconBgColor="bg-secondary/20"
          iconColor="text-secondary"
          change={{ value: "18%", positive: true }}
          changeText="em relação ao mês anterior"
        />
        <StatCard
          title="Taxa de Conversão"
          value="68%"
          icon="fas fa-chart-line"
          iconBgColor="bg-green-500/20"
          iconColor="text-green-500"
          change={{ value: "5%", positive: true }}
          changeText="em relação ao mês anterior"
        />
        <StatCard
          title="Receita Total (Mês)"
          value="R$ 24.650"
          icon="fas fa-dollar-sign"
          iconBgColor="bg-accent/20"
          iconColor="text-accent"
          change={{ value: "3%", positive: false }}
          changeText="em relação ao mês anterior"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-2">
          <ChartPlaceholder
            title="Consultas Agendadas"
            chartType="bar"
            data={barChartData}
            onPeriodChange={setChartPeriod}
            height={300}
          />
        </div>
        <ChartPlaceholder
          title="Conversão de Leads"
          chartType="funnel"
          data={funnelData}
          periodOptions={["Este Mês", "Últimos 3 Meses", "Este Ano"]}
          defaultPeriod="Este Mês"
          height={300}
        />
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Appointments */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">Consultas de Hoje</CardTitle>
            <a href="/agenda" className="text-primary text-sm hover:underline">
              Ver Todas
            </a>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border">
                    <TableHead className="text-left text-sm font-medium text-gray-400">
                      Paciente
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-gray-400">
                      Horário
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-gray-400">
                      Procedimento
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-gray-400">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((appointment, index) => (
                    <TableRow
                      key={appointment.id}
                      className={
                        index < todayAppointments.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    >
                      <TableCell className="py-3 text-sm">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={appointment.initalsColor}>
                              {appointment.clientInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="ml-2 text-white">
                            {appointment.clientName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-300">
                        {appointment.time}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-300">
                        {appointment.procedure}
                      </TableCell>
                      <TableCell className="py-3 text-sm">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 text-xs rounded-full ${appointment.statusColor}`}
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">
              Notificações
            </CardTitle>
            <Button
              variant="link"
              onClick={() =>
                toast({
                  title: "Notificações",
                  description: "Todas as notificações foram marcadas como lidas.",
                })
              }
              className="text-primary text-sm hover:underline h-auto p-0"
            >
              Marcar todas como lidas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  icon={notification.icon}
                  iconBgColor={notification.iconBgColor}
                  iconColor={notification.iconColor}
                  title={notification.title}
                  description={notification.description}
                  time={notification.time}
                  actionLabel={notification.actionLabel}
                  onActionClick={notification.onActionClick}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
