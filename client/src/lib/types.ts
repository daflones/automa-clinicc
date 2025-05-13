export type UserRole = "ADMIN" | "SECRETARIA" | "PROFISSIONAL";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export type FunnelStage = "NOVO_LEAD" | "PRIMEIRO_CONTATO" | "AVALIACAO_AGENDADA" | "PROCEDIMENTO_AGENDADO" | "POS_VENDA_RECORRENTE";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  funnelStage: FunnelStage;
  interests: string[];
  notes?: string;
  lastInteraction: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  procedureId: string;
  procedure: string;
  date: string;
  time: string;
  notes?: string;
  status: "AGENDADO" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface Professional {
  id: string;
  name: string;
  specialties: string[];
  availableDays: string[];
  availableHours: string[];
}
