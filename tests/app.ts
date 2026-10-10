import Fastify from "fastify";
import jwt from "@fastify/jwt";
import AuthRoutes from "../routes/auth.routes.js";
import leesprofielRoutes from "../routes/Leesprofiel.routes.js";

export function buildApp() {
  const app = Fastify();

  // ⭐ JWT plugin toevoegen
  app.register(jwt, {
    secret: "test-secret"
  });

  // ⭐ Auth routes registreren
  app.register(AuthRoutes);

  // ⭐ Leesprofiel routes registreren
  app.register(leesprofielRoutes);

  app.get("/", () => "Hello World!");

  return app;
}
