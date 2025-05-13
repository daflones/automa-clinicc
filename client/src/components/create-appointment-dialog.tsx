import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment, Client } from "@/lib/types";

const formSchema = z.object({
  clientId: z.string().min(1, { message: "Selecione um cliente" }),
  procedureId: z.string().min(1, { message: "Selecione um procedimento" }),
  professionalId: z.string().min(1, { message: "Selecione um profissional" }),
  date: z.string().min(1, { message: "Selecione uma data" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  clients: Client[];
  initialData?: Partial<Appointment>;
  isEditing?: boolean;
}

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  clients,
  initialData,
  isEditing = false,
}: CreateAppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState(initialData?.date || "");
  const [selectedTime, setSelectedTime] = useState(initialData?.time || "");

  const procedures = [
    "Botox",
    "Preenchimento Labial",
    "Limpeza de Pele",
    "Microagulhamento",
    "Peeling Químico",
    "Toxina Botulínica",
    "Avaliação Facial",
    "Skincare",
  ];

  const professionals = [
    { id: "1", name: "Dra. Amanda Silva" },
    { id: "2", name: "Dr. Carlos Mendes" },
    { id: "3", name: "Dra. Juliana Martins" },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  // Mocked unavailable slots for demo
  const unavailableSlots = ["12:00", "12:30"];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      procedureId: initialData?.procedureId || "",
      professionalId: initialData?.professionalId || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      notes: initialData?.notes || "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do agendamento abaixo." 
              : "Agende um novo procedimento ou consulta."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="procedureId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedimento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um procedimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {procedures.map((procedure, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {procedure}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="professionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um profissional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professionals.map((professional) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedDate(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const isUnavailable = unavailableSlots.includes(time);
                      const isSelected = field.value === time;
                      
                      return (
                        <Button
                          key={time}
                          type="button"
                          className={cn(
                            "time-slot py-2 px-3 text-sm rounded-md border",
                            isUnavailable && "unavailable",
                            isSelected && "selected",
                            !isUnavailable && !isSelected && "border-gray-700 text-gray-300"
                          )}
                          disabled={isUnavailable}
                          onClick={() => {
                            if (!isUnavailable) {
                              field.onChange(time);
                              setSelectedTime(time);
                            }
                          }}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre o agendamento..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar Agendamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
