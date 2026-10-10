import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import request from "supertest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "./app.js";
import { authenticate } from "../auth/guards.js";

vi.mock("../auth/guards.js", () => ({
authenticate: async (req: any, reply: any) => {
    req.user = { id: 3, name: "student", role: "student" };
  }
}));


// Mock AuthService
vi.mock("../service/auth.service.js", () => ({
  AuthService: {
    login: vi.fn(async (name, password) => {
      if (name === "student" && password === "1234") {
        return {
          id: 3,
          name: "student",
          role: "student"
        };
      }

      return {
        error: "Invalid credentials",
        status: 401
      };
    }),
    register: vi.fn()
  }
}));

// Mock LeesprofielService
vi.mock("../service/leesprofiel.service.js", () => ({
  LeesprofielService: {
    save: vi.fn(async (studentId, data) => {
      return {
        studentId,
        ...data
      };
    })
  }
}));

describe("Leesprofiel aanmaken (e2e)", () => {
  let app: FastifyInstance;
  let token: string;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();

    // Eerst inloggen
    const loginRes = await request(app.server)
      .post("/login")
      .send({ name: "student", password: "1234" })
      .expect(200);

    token = loginRes.body.token;
  });

  afterEach(async () => {
    await app.close();
  });

 it("should create a leesprofiel when logged in", async () => {
  const res = await request(app.server)
    .post("/leesprofiel")
    .set("Authorization", `Bearer ${token}`)
    .send({
      genre: ["Fictie"],
      onderwerp: ["Vriendschap"],
      niveau: "B1",
      lengte: "kort",
      leesdoel: "begrijpend lezen"
    })
    .expect(201);

expect(res.body).toHaveProperty("studentId", "3");
  expect(res.body).toHaveProperty("niveau", "B1");
});


});
