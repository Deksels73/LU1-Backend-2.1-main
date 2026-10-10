import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import request from "supertest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "./app.js";

describe("Fastify App (e2e)", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET / should return Hello World!", async () => {
    const res = await request(app.server)
      .get("/")
      .expect(200);

    expect(res.text).toBe("Hello World!");
  });

});
