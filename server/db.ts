import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Verificar se DATABASE_URL está definida
let pool;
let db;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("Banco de dados conectado com sucesso");
  } else {
    console.log("DATABASE_URL não está definida, usando armazenamento em memória");
    // Criando um "mock" do db para evitar erros quando usando armazenamento em memória
    db = {
      select: () => ({ from: () => ({ where: () => [] }) }),
      insert: () => ({ values: () => ({ returning: () => [] }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) })
    };
  }
} catch (error) {
  console.error("Erro ao conectar ao banco de dados:", error);
  // Criando um "mock" do db para evitar erros quando usando armazenamento em memória
  db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) })
  };
}

export { pool, db };