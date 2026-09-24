import "dotenv/config";
import app from "./app.ts";

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Falta la variable de entorno ${key} (revisa tu .env)`);
  }
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
