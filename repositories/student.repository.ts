import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { students, teachers, teacherStudent } from "./schema.js";
import { config } from "../config.js";

const db = drizzle(config.databaseUrl);

export const StudentRepository = {
  async findByName(name: string) {
    return db.select().from(students).where(eq(students.name, name));
  },

  async create(name: string, hashedPassword: string, code: string) {
    return db.insert(students).values({
      name,
      password: hashedPassword,
      code,
    });
  },

  // Aan welke docent is deze leerling gekoppeld?
  async getTeacher(studentId: number) {
    const result = await db
      .select({ id: teachers.id, name: teachers.name })
      .from(teacherStudent)
      .innerJoin(teachers, eq(teacherStudent.teacherId, teachers.id))
      .where(eq(teacherStudent.studentId, studentId));

    return result[0] ?? null;
  },

  // Vervangt de huidige koppeling door een nieuwe (één docent per leerling)
  async setTeacher(studentId: number, teacherId: number) {
    await db.transaction(async (tx) => {
      await tx.delete(teacherStudent).where(eq(teacherStudent.studentId, studentId));
      await tx.insert(teacherStudent).values({ teacherId, studentId });
    });
  },
};