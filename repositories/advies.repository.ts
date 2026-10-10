import { leesprofiel, leesadvies } from "./schema.js";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from "../config.js";

const db = drizzle(config.databaseUrl);

export const AdviesRepository = {
  async getProfiel(studentId: string) {
    const result = await db
      .select()
      .from(leesprofiel)
      .where(eq(leesprofiel.studentId, studentId));

    return result[0] || null;
  },

  async saveAdvies(studentId: string, advies: any[]) {
    for (const item of advies) {
      await db.insert(leesadvies).values({
        studentId,
        bookId: item.bookId,
        reason: item.reason
      });
    }
  },

  async getAdvies(studentId: string) {
    return db
      .select()
      .from(leesadvies)
      .where(eq(leesadvies.studentId, studentId));
  },
  
  async deleteAdvies(studentId: string) {
  await db.delete(leesadvies).where(eq(leesadvies.studentId, studentId));
}

};
