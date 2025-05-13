import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Header } from "@/components/header";
import { AppointmentCalendar } from "@/components/appointment-calendar";
import { CreateAppointmentDialog } from "@/components/create-appointment-dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Client, Appointment } from "@/lib/types";

export default function Calendar() {
  const { toast } = useToast();
  const [createAppointmentOpen, setCreateAppointmentOpen] = useState(false);

  // Fetch appointments data
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  // Fetch clients data for appointment creation
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao criar agendamento: ${error.message}`,
      });
    },
  });

  const handleCreateAppointment = (data: any) => {
    createAppointment.mutate(data);
  };

  return (
    <div className="p-6">
      <Header
        title="Agenda"
        subtitle="Visualize e gerencie seus agendamentos."
        actionLabel="Novo Agendamento"
        actionIcon="fas fa-plus"
        onActionClick={() => setCreateAppointmentOpen(true)}
      />

      {/* Calendar View */}
      <AppointmentCalendar
        appointments={appointments}
        onAddAppointment={() => setCreateAppointmentOpen(true)}
      />

      {/* Create Appointment Dialog */}
      <CreateAppointmentDialog
        open={createAppointmentOpen}
        onOpenChange={setCreateAppointmentOpen}
        onSubmit={handleCreateAppointment}
        clients={clients}
      />
    </div>
  );
}
