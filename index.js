import "dotenv/config"; // altijd als eerste
import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyPassport from "@fastify/passport";
import fastifyJwt from "@fastify/jwt";
import fastifySecureSession from "@fastify/secure-session";
import { MongoClient } from "mongodb";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { registerJwtStrategy } from "./auth/jwt.strategy.js";
import authRoutes from "./routes/auth.routes.js";
import leesprofielRoutes from "./routes/Leesprofiel.routes.js";
import leeslijst from "./routes/leeslijst.routes.js";
import docent from "./routes/docent.route.js";
import adviesRoutes from "./routes/advies.route.js";
import koppelRoutes from "./routes/koppel.route.js";
// Duidelijke fout als een geheim ontbreekt
for (const key of ["JWT_SECRET", "SESSION_KEY", "MONGODB_URI"]) {
    if (!process.env[key])
        throw new Error(`Omgevingsvariabele ${key} ontbreekt in .env`);
}
const server = fastify();
const client = new MongoClient(process.env.MONGODB_URI);
await server.register(cors, {
    origin: "*", // later vervangen door de URL van je frontend
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
});
// ---------- Auth ----------
await server.register(fastifySecureSession, {
    key: Buffer.from(process.env.SESSION_KEY, "hex"),
});
await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    decoratorName: "jwtPayload",
    sign: { expiresIn: "2h" },
});
await server.register(fastifyPassport.initialize());
registerJwtStrategy();
await server.register(fastifySwagger, {
    mode: "static",
    specification: { path: "./openapi.yaml", baseDir: process.cwd() },
});
await server.register(fastifySwaggerUi, { routePrefix: "/docs" });
// ---------- Routes (pas ná de auth-setup) ----------
await server.register(authRoutes);
await server.register(leesprofielRoutes);
await server.register(leeslijst);
await server.register(docent);
await server.register(adviesRoutes);
await server.register(koppelRoutes);
server.get("/catalog", async (request) => {
    await client.connect();
    const collection = client.db("LU1_Database").collection("catalogus");
    const page = parseInt(request.query.page ?? "1");
    const limit = 6;
    const skip = (page - 1) * limit;
    const mongoFilter = {};
    // ---- NIVEAU (meerdere waarden mogelijk) ----
    if (request.query.niveau) {
        const niveaus = Array.isArray(request.query.niveau)
            ? request.query.niveau
            : [request.query.niveau];
        mongoFilter.Niveau = { $in: niveaus };
    }
    // ---- TYPE (meerdere waarden mogelijk) ----
    if (request.query.type) {
        const types = Array.isArray(request.query.type)
            ? request.query.type
            : [request.query.type];
        mongoFilter["Type materiaal"] = { $in: types };
    }
    // ---- THEMA (meerdere waarden mogelijk) ----
    if (request.query.thema) {
        const themas = Array.isArray(request.query.thema)
            ? request.query.thema
            : [request.query.thema];
        // Maak een regex die alle thema's matcht
        const themaRegex = themas.join("|");
        mongoFilter.Themas_boek = {
            $regex: themaRegex,
            $options: "i",
        };
    }
    // ---- Query uitvoeren ----
    const rawBooks = await collection.find(mongoFilter).skip(skip).limit(limit).toArray();
    const books = rawBooks.map((book) => ({
        _id: book._id,
        Titel: book.Titel,
        Auteur: book.Auteur,
        type: book["Type materiaal"],
        niveau: book.Niveau,
        thema: book.Themas_boek,
        beschrijving: book["Korte omschrijving"],
    }));
    const total = await collection.countDocuments(mongoFilter);
    return { page, limit, total, books };
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=index.js.map