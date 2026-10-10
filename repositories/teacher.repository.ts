import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { teachers } from "./schema.js";
import { config } from "../config.js";

const db = drizzle(config.databaseUrl);

export const TeacherRepository = {
  async findByName(name: string) {
    return db.select().from(teachers).where(eq(teachers.name, name));
  },

  async create(name: string, hashedPassword: string, code: string) {
    return db.insert(teachers).values({
      name,
      password: hashedPassword,
      code,
    });
  },

  // Alleen id en naam: nooit het wachtwoord of de registratiecode teruggeven
  async getAll() {
    return db
      .select({ id: teachers.id, name: teachers.name })
      .from(teachers)
      .orderBy(teachers.name);
  },

  async findById(id: number) {
    const result = await db
      .select({ id: teachers.id, name: teachers.name })
      .from(teachers)
      .where(eq(teachers.id, id));

    return result[0] ?? null;
  },
};