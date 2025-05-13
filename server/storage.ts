import {
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  procedures, type Procedure, type InsertProcedure,
  appointments, type Appointment, type InsertAppointment,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";
import { format, parseISO, isSameDay, startOfDay, endOfDay, subDays } from "date-fns";
import { db } from "./db";
import { eq, and, gte, lte, desc, not, asc } from "drizzle-orm";

export interface IStorage {
  // Usuários
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Clientes
  getAllClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined>;
  updateClientFunnelStage(id: number, funnelStage: string): Promise<Client | undefined>;
  getClientsByFunnelStage(): Promise<Record<string, number>>;
  
  // Procedimentos
  getAllProcedures(): Promise<Procedure[]>;
  getProcedure(id: number): Promise<Procedure | undefined>;
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  
  // Agendamentos
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  isTimeSlotAvailable(date: string, time: string, professionalId: number): Promise<boolean>;
  getTodayAppointments(): Promise<Appointment[]>;
  getLastWeekAppointments(): Promise<Appointment[]>;
  
  // Notificações
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  getRecentNotifications(): Promise<Notification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private procedures: Map<number, Procedure>;
  private appointments: Map<number, Appointment>;
  private notifications: Map<number, Notification>;
  
  private userCurrentId: number;
  private clientCurrentId: number;
  private procedureCurrentId: number;
  private appointmentCurrentId: number;
  private notificationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.procedures = new Map();
    this.appointments = new Map();
    this.notifications = new Map();
    
    this.userCurrentId = 1;
    this.clientCurrentId = 1;
    this.procedureCurrentId = 1;
    this.appointmentCurrentId = 1;
    this.notificationCurrentId = 1;
    
    // Adicionar usuário administrador inicial
    this.createUser({
      username: "admin",
      password: "admin123",
      name: "Administrador",
      role: "ADMIN"
    });
    
    this.createUser({
      username: "secretaria",
      password: "secretaria123",
      name: "Ana Secretária",
      role: "SECRETARIA"
    });
    
    this.createUser({
      username: "profissional",
      password: "profissional123",
      name: "Dra. Amanda Silva",
      role: "PROFISSIONAL"
    });
    
    // Adicionar alguns procedimentos iniciais
    this.createProcedure({
      name: "Botox",
      description: "Aplicação de toxina botulínica para reduzir rugas e linhas de expressão",
      duration: 60,
      price: 80000 // R$ 800,00
    });
    
    this.createProcedure({
      name: "Preenchimento Labial",
      description: "Aplicação de ácido hialurônico para dar volume aos lábios",
      duration: 45,
      price: 120000 // R$ 1.200,00
    });
    
    this.createProcedure({
      name: "Limpeza de Pele",
      description: "Procedimento para remover impurezas e células mortas da pele",
      duration: 90,
      price: 35000 // R$ 350,00
    });
    
    this.createProcedure({
      name: "Microagulhamento",
      description: "Tratamento para estimular a produção de colágeno e melhorar a textura da pele",
      duration: 75,
      price: 45000 // R$ 450,00
    });

    // Adicionar alguns clientes iniciais
    this.createClient({
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(11) 98765-4321",
      cpf: "123.456.789-00",
      funnelStage: "POS_VENDA_RECORRENTE",
      interests: ["Botox", "Preenchimento Labial"],
      notes: "Cliente recorrente, prefere atendimento nas quartas-feiras"
    });
    
    this.createClient({
      name: "João Pereira",
      email: "joao.pereira@email.com",
      phone: "(11) 97654-3210",
      funnelStage: "AVALIACAO_AGENDADA",
      interests: ["Avaliação Facial"],
      notes: "Primeiro contato feito via Instagram"
    });
    
    this.createClient({
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 96543-2109",
      cpf: "987.654.321-00",
      funnelStage: "PROCEDIMENTO_AGENDADO",
      interests: ["Preenchimento Labial", "Skincare"],
      notes: "Indicada pela Maria Silva"
    });
    
    this.createClient({
      name: "Roberto Santos",
      email: "roberto.santos@email.com",
      phone: "(11) 95432-1098",
      funnelStage: "AVALIACAO_AGENDADA",
      interests: ["Microagulhamento"],
      notes: "Sensível a anestésicos"
    });
    
    // Adicionar agendamentos iniciais
    const today = new Date();
    const formattedToday = format(today, "yyyy-MM-dd");
    
    this.createAppointment({
      clientId: 1,
      professionalId: 3,
      procedureId: 1,
      date: formattedToday,
      time: "09:00",
      status: "CONFIRMADO",
      notes: "Primeira sessão de Botox"
    });
    
    this.createAppointment({
      clientId: 2,
      professionalId: 3,
      procedureId: 5, // Fictício (Avaliação Facial)
      date: formattedToday,
      time: "11:00",
      status: "AGENDADO",
      notes: "Avaliação inicial"
    });
    
    this.createAppointment({
      clientId: 3,
      professionalId: 3,
      procedureId: 2,
      date: formattedToday,
      time: "14:30",
      status: "CONFIRMADO",
      notes: "Segunda sessão de preenchimento"
    });
    
    this.createAppointment({
      clientId: 4,
      professionalId: 3,
      procedureId: 4,
      date: formattedToday,
      time: "16:00",
      status: "CONFIRMADO",
      notes: "Primeira sessão de microagulhamento"
    });
  }

  // Métodos para Usuários
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Métodos para Clientes
  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientCurrentId++;
    const lastInteraction = new Date();
    const createdAt = new Date();
    
    // Formatar interesses como array se não for
    const interests = Array.isArray(insertClient.interests)
      ? insertClient.interests
      : insertClient.interests ? [insertClient.interests] : [];
    
    const client: Client = { 
      ...insertClient, 
      interests,
      id, 
      lastInteraction, 
      createdAt 
    };
    
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient: Client = {
      ...client,
      ...clientData,
      // Manter arrays ou objetos que possam ter sido substituídos parcialmente
      interests: clientData.interests || client.interests,
      lastInteraction: new Date()
    };
    
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async updateClientFunnelStage(id: number, funnelStage: string): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient: Client = {
      ...client,
      funnelStage,
      lastInteraction: new Date()
    };
    
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async getClientsByFunnelStage(): Promise<Record<string, number>> {
    const result = {
      NOVO_LEAD: 0,
      PRIMEIRO_CONTATO: 0,
      AVALIACAO_AGENDADA: 0,
      PROCEDIMENTO_AGENDADO: 0,
      POS_VENDA_RECORRENTE: 0
    };
    
    for (const client of this.clients.values()) {
      if (client.funnelStage in result) {
        result[client.funnelStage]++;
      }
    }
    
    return result;
  }

  // Métodos para Procedimentos
  async getAllProcedures(): Promise<Procedure[]> {
    return Array.from(this.procedures.values());
  }

  async getProcedure(id: number): Promise<Procedure | undefined> {
    return this.procedures.get(id);
  }

  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const id = this.procedureCurrentId++;
    const createdAt = new Date();
    const procedure: Procedure = { ...insertProcedure, id, createdAt };
    this.procedures.set(id, procedure);
    return procedure;
  }

  // Métodos para Agendamentos
  async getAllAppointments(): Promise<Appointment[]> {
    const appointments = Array.from(this.appointments.values());
    const result = [];
    
    // Adicionar informações do cliente e procedimento para facilitar o uso no frontend
    for (const appointment of appointments) {
      const client = this.clients.get(appointment.clientId);
      const procedure = this.procedures.get(appointment.procedureId);
      const professional = this.users.get(appointment.professionalId);
      
      if (client && professional) {
        result.push({
          ...appointment,
          clientName: client.name,
          procedureId: appointment.procedureId,
          procedure: procedure?.name || "Consulta",
          professionalName: professional.name
        });
      }
    }
    
    return result;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentCurrentId++;
    const createdAt = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    
    // Atualizar estágio do cliente no funil se estiver em um estágio anterior
    const client = this.clients.get(insertAppointment.clientId);
    if (client) {
      const currentStageOrder = {
        NOVO_LEAD: 0,
        PRIMEIRO_CONTATO: 1,
        AVALIACAO_AGENDADA: 2,
        PROCEDIMENTO_AGENDADO: 3,
        POS_VENDA_RECORRENTE: 4
      };
      
      // Se o cliente estiver em um estágio anterior ao agendamento de procedimento,
      // atualizar para o estágio correspondente
      if (currentStageOrder[client.funnelStage] < currentStageOrder.PROCEDIMENTO_AGENDADO) {
        this.updateClientFunnelStage(client.id, "PROCEDIMENTO_AGENDADO");
      }
    }
    
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment: Appointment = {
      ...appointment,
      status
    };
    
    this.appointments.set(id, updatedAppointment);
    
    // Se o status for CONCLUIDO, atualizar o estágio do cliente para POS_VENDA_RECORRENTE
    if (status === "CONCLUIDO") {
      const client = this.clients.get(appointment.clientId);
      if (client) {
        this.updateClientFunnelStage(client.id, "POS_VENDA_RECORRENTE");
      }
    }
    
    return updatedAppointment;
  }

  async isTimeSlotAvailable(date: string, time: string, professionalId: number): Promise<boolean> {
    for (const appointment of this.appointments.values()) {
      if (
        appointment.date === date &&
        appointment.time === time &&
        appointment.professionalId === professionalId &&
        appointment.status !== "CANCELADO"
      ) {
        return false;
      }
    }
    return true;
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    const appointments = Array.from(this.appointments.values())
      .filter(appointment => appointment.date === todayStr);
    
    const result = [];
    
    for (const appointment of appointments) {
      const client = this.clients.get(appointment.clientId);
      const procedure = this.procedures.get(appointment.procedureId);
      const professional = this.users.get(appointment.professionalId);
      
      if (client && professional) {
        result.push({
          ...appointment,
          clientName: client.name,
          procedureId: appointment.procedureId,
          procedure: procedure?.name || "Consulta",
          professionalName: professional.name
        });
      }
    }
    
    return result;
  }

  async getLastWeekAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const lastWeek = subDays(today, 7);
    
    const appointments = Array.from(this.appointments.values())
      .filter(appointment => {
        const appointmentDate = parseISO(appointment.date);
        return appointmentDate >= lastWeek && appointmentDate <= today;
      });
    
    const result = [];
    
    for (const appointment of appointments) {
      const client = this.clients.get(appointment.clientId);
      const procedure = this.procedures.get(appointment.procedureId);
      const professional = this.users.get(appointment.professionalId);
      
      if (client && professional) {
        result.push({
          ...appointment,
          clientName: client.name,
          procedureId: appointment.procedureId,
          procedure: procedure?.name || "Consulta",
          professionalName: professional.name
        });
      }
    }
    
    return result;
  }

  // Métodos para Notificações
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const createdAt = new Date();
    const notification: Notification = { 
      ...insertNotification,
      id,
      read: false, 
      createdAt 
    };
    
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async getRecentNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }
}

export class DatabaseStorage implements IStorage {
  // Métodos para Usuários
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Métodos para Clientes
  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    // Formatar interesses como array se não for
    const interests = Array.isArray(insertClient.interests)
      ? insertClient.interests
      : insertClient.interests ? [insertClient.interests] : [];
    
    const [client] = await db
      .insert(clients)
      .values({
        ...insertClient,
        interests,
        lastInteraction: new Date()
      })
      .returning();
    
    return client;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = await this.getClient(id);
    if (!client) return undefined;
    
    // Preservar interesses existentes se não foram fornecidos
    const interests = clientData.interests
      ? (Array.isArray(clientData.interests)
          ? clientData.interests
          : [clientData.interests])
      : client.interests;
    
    const [updatedClient] = await db
      .update(clients)
      .set({
        ...clientData,
        interests,
        lastInteraction: new Date()
      })
      .where(eq(clients.id, id))
      .returning();
    
    return updatedClient || undefined;
  }

  async updateClientFunnelStage(id: number, funnelStage: string): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set({
        funnelStage,
        lastInteraction: new Date()
      })
      .where(eq(clients.id, id))
      .returning();
    
    return updatedClient || undefined;
  }

  async getClientsByFunnelStage(): Promise<Record<string, number>> {
    const result = {
      NOVO_LEAD: 0,
      PRIMEIRO_CONTATO: 0,
      AVALIACAO_AGENDADA: 0,
      PROCEDIMENTO_AGENDADO: 0,
      POS_VENDA_RECORRENTE: 0
    };
    
    const clientList = await db.select().from(clients);
    
    for (const client of clientList) {
      if (client.funnelStage in result) {
        result[client.funnelStage]++;
      }
    }
    
    return result;
  }

  // Métodos para Procedimentos
  async getAllProcedures(): Promise<Procedure[]> {
    return await db.select().from(procedures);
  }

  async getProcedure(id: number): Promise<Procedure | undefined> {
    const [procedure] = await db.select().from(procedures).where(eq(procedures.id, id));
    return procedure || undefined;
  }

  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const [procedure] = await db
      .insert(procedures)
      .values(insertProcedure)
      .returning();
    
    return procedure;
  }

  // Métodos para Agendamentos
  async getAllAppointments(): Promise<Appointment[]> {
    const appointmentList = await db.select().from(appointments);
    const clientList = await db.select().from(clients);
    const procedureList = await db.select().from(procedures);
    const userList = await db.select().from(users);
    
    // Criar mapas para pesquisa rápida
    const clientMap = new Map(clientList.map(client => [client.id, client]));
    const procedureMap = new Map(procedureList.map(procedure => [procedure.id, procedure]));
    const userMap = new Map(userList.map(user => [user.id, user]));
    
    return appointmentList.map(appointment => {
      const client = clientMap.get(appointment.clientId);
      const procedure = procedureMap.get(appointment.procedureId);
      const professional = userMap.get(appointment.professionalId);
      
      return {
        ...appointment,
        clientName: client?.name || "Cliente Desconhecido",
        procedure: procedure?.name || "Consulta",
        professionalName: professional?.name || "Profissional Desconhecido"
      };
    });
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    
    // Atualizar estágio do cliente no funil se estiver em um estágio anterior
    const client = await this.getClient(insertAppointment.clientId);
    if (client) {
      const currentStageOrder = {
        NOVO_LEAD: 0,
        PRIMEIRO_CONTATO: 1,
        AVALIACAO_AGENDADA: 2,
        PROCEDIMENTO_AGENDADO: 3,
        POS_VENDA_RECORRENTE: 4
      };
      
      // Se o cliente estiver em um estágio anterior ao agendamento de procedimento,
      // atualizar para o estágio correspondente
      if (currentStageOrder[client.funnelStage] < currentStageOrder.PROCEDIMENTO_AGENDADO) {
        await this.updateClientFunnelStage(client.id, "PROCEDIMENTO_AGENDADO");
      }
    }
    
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    
    // Se o status for CONCLUIDO, atualizar o estágio do cliente para POS_VENDA_RECORRENTE
    if (status === "CONCLUIDO" && updatedAppointment) {
      const client = await this.getClient(updatedAppointment.clientId);
      if (client) {
        await this.updateClientFunnelStage(client.id, "POS_VENDA_RECORRENTE");
      }
    }
    
    return updatedAppointment || undefined;
  }

  async isTimeSlotAvailable(date: string, time: string, professionalId: number): Promise<boolean> {
    const existingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.date, date),
          eq(appointments.time, time),
          eq(appointments.professionalId, professionalId),
          not(eq(appointments.status, "CANCELADO"))
        )
      );
    
    return existingAppointments.length === 0;
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = format(new Date(), "yyyy-MM-dd");
    
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(eq(appointments.date, today));
    
    const clientList = await db.select().from(clients);
    const procedureList = await db.select().from(procedures);
    const userList = await db.select().from(users);
    
    // Criar mapas para pesquisa rápida
    const clientMap = new Map(clientList.map(client => [client.id, client]));
    const procedureMap = new Map(procedureList.map(procedure => [procedure.id, procedure]));
    const userMap = new Map(userList.map(user => [user.id, user]));
    
    return appointmentList.map(appointment => {
      const client = clientMap.get(appointment.clientId);
      const procedure = procedureMap.get(appointment.procedureId);
      const professional = userMap.get(appointment.professionalId);
      
      return {
        ...appointment,
        clientName: client?.name || "Cliente Desconhecido",
        procedure: procedure?.name || "Consulta",
        professionalName: professional?.name || "Profissional Desconhecido"
      };
    });
  }

  async getLastWeekAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const lastWeek = subDays(today, 7);
    const todayStr = format(today, "yyyy-MM-dd");
    const lastWeekStr = format(lastWeek, "yyyy-MM-dd");
    
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.date, lastWeekStr),
          lte(appointments.date, todayStr)
        )
      );
    
    const clientList = await db.select().from(clients);
    const procedureList = await db.select().from(procedures);
    const userList = await db.select().from(users);
    
    // Criar mapas para pesquisa rápida
    const clientMap = new Map(clientList.map(client => [client.id, client]));
    const procedureMap = new Map(procedureList.map(procedure => [procedure.id, procedure]));
    const userMap = new Map(userList.map(user => [user.id, user]));
    
    return appointmentList.map(appointment => {
      const client = clientMap.get(appointment.clientId);
      const procedure = procedureMap.get(appointment.procedureId);
      const professional = userMap.get(appointment.professionalId);
      
      return {
        ...appointment,
        clientName: client?.name || "Cliente Desconhecido",
        procedure: procedure?.name || "Consulta",
        professionalName: professional?.name || "Profissional Desconhecido"
      };
    });
  }

  // Métodos para Notificações
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...insertNotification,
        read: false
      })
      .returning();
    
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    
    return updatedNotification || undefined;
  }

  async getRecentNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  }
}

// Usando armazenamento em memória por enquanto
// Descomentar a linha abaixo quando o banco de dados estiver disponível
// export const storage = new DatabaseStorage();
export const storage = new MemStorage();
