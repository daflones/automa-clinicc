import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertClientSchema, insertAppointmentSchema, insertProcedureSchema, insertNotificationSchema } from "@shared/schema";
import { FunnelStage } from "@/lib/types";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro de login:", error);
      return res.status(500).json({ message: "Erro ao processar o login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao finalizar sessão" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logout realizado com sucesso" });
      });
    } else {
      return res.status(200).json({ message: "Nenhuma sessão ativa" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      return res.status(500).json({ message: "Erro ao verificar autenticação" });
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    
    req.user = user;
    next();
  };

  // Users endpoints
  app.get("/api/users", isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      return res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.post("/api/users", isAuthenticated, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de usuário inválidos", errors: error.errors });
      }
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }
  });

  // Clients endpoints
  app.get("/api/clients", isAuthenticated, async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      return res.status(200).json(clients);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      return res.status(500).json({ message: "Erro ao buscar clientes" });
    }
  });

  app.get("/api/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de cliente inválido" });
      }
      
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      return res.status(200).json(client);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return res.status(500).json({ message: "Erro ao buscar cliente" });
    }
  });

  app.post("/api/clients", isAuthenticated, async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const newClient = await storage.createClient(clientData);
      return res.status(201).json(newClient);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de cliente inválidos", errors: error.errors });
      }
      return res.status(500).json({ message: "Erro ao criar cliente" });
    }
  });

  app.patch("/api/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de cliente inválido" });
      }
      
      // Validate client data
      const clientData = insertClientSchema.partial().parse(req.body);
      
      const updatedClient = await storage.updateClient(id, clientData);
      if (!updatedClient) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      return res.status(200).json(updatedClient);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de cliente inválidos", errors: error.errors });
      }
      return res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
  });

  app.patch("/api/clients/:id/funnel-stage", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de cliente inválido" });
      }
      
      const { funnelStage } = req.body;
      if (!funnelStage || !Object.values(["NOVO_LEAD", "PRIMEIRO_CONTATO", "AVALIACAO_AGENDADA", "PROCEDIMENTO_AGENDADO", "POS_VENDA_RECORRENTE"]).includes(funnelStage)) {
        return res.status(400).json({ message: "Estágio do funil inválido" });
      }
      
      const updatedClient = await storage.updateClientFunnelStage(id, funnelStage);
      if (!updatedClient) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      return res.status(200).json(updatedClient);
    } catch (error) {
      console.error("Erro ao atualizar estágio do funil:", error);
      return res.status(500).json({ message: "Erro ao atualizar estágio do funil" });
    }
  });

  // Appointments endpoints
  app.get("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      return res.status(200).json(appointments);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return res.status(500).json({ message: "Erro ao buscar agendamentos" });
    }
  });

  app.post("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      // Check for time conflicts
      const isTimeSlotAvailable = await storage.isTimeSlotAvailable(
        appointmentData.date,
        appointmentData.time,
        appointmentData.professionalId
      );
      
      if (!isTimeSlotAvailable) {
        return res.status(409).json({ message: "Este horário já está ocupado" });
      }
      
      const newAppointment = await storage.createAppointment(appointmentData);
      return res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de agendamento inválidos", errors: error.errors });
      }
      return res.status(500).json({ message: "Erro ao criar agendamento" });
    }
  });

  app.patch("/api/appointments/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de agendamento inválido" });
      }
      
      const { status } = req.body;
      if (!status || !["AGENDADO", "CONFIRMADO", "CANCELADO", "CONCLUIDO"].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }
      
      const updatedAppointment = await storage.updateAppointmentStatus(id, status);
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      
      return res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
      return res.status(500).json({ message: "Erro ao atualizar status do agendamento" });
    }
  });

  // Procedures endpoints
  app.get("/api/procedures", isAuthenticated, async (req, res) => {
    try {
      const procedures = await storage.getAllProcedures();
      return res.status(200).json(procedures);
    } catch (error) {
      console.error("Erro ao buscar procedimentos:", error);
      return res.status(500).json({ message: "Erro ao buscar procedimentos" });
    }
  });

  app.post("/api/procedures", isAuthenticated, async (req, res) => {
    try {
      const procedureData = insertProcedureSchema.parse(req.body);
      const newProcedure = await storage.createProcedure(procedureData);
      return res.status(201).json(newProcedure);
    } catch (error) {
      console.error("Erro ao criar procedimento:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de procedimento inválidos", errors: error.errors });
      }
      return res.status(500).json({ message: "Erro ao criar procedimento" });
    }
  });

  // Notifications endpoints
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      const notifications = await storage.getUserNotifications(req.user.id);
      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return res.status(500).json({ message: "Erro ao buscar notificações" });
    }
  });

  app.post("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const newNotification = await storage.createNotification(notificationData);
      return res.status(201).json(newNotification);
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de notificação inválidos", errors: error.errors });
      }
      return res.status(500).json({ message: "Erro ao criar notificação" });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de notificação inválido" });
      }
      
      const updatedNotification = await storage.markNotificationAsRead(id);
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      
      return res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      return res.status(500).json({ message: "Erro ao marcar notificação como lida" });
    }
  });

  // Dashboard data endpoint
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const todayAppointments = await storage.getTodayAppointments();
      const lastWeekAppointments = await storage.getLastWeekAppointments();
      const clientsByFunnelStage = await storage.getClientsByFunnelStage();
      const recentNotifications = await storage.getRecentNotifications();
      
      return res.status(200).json({
        todayAppointments,
        lastWeekAppointments,
        clientsByFunnelStage,
        recentNotifications
      });
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      return res.status(500).json({ message: "Erro ao buscar dados do dashboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
