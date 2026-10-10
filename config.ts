import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Omgevingsvariabele ${name} ontbreekt in .env`);
  return value;
}

export const config = {
  databaseUrl: required("DATABASE_URL"),
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  sessionKey: required("SESSION_KEY"),
};