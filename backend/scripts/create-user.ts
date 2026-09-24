import "dotenv/config";
import readline from "node:readline";
import { Writable } from "node:stream";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.ts";

let muted = false;
const rl = readline.createInterface({
  input: process.stdin,
  output: new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  }),
  terminal: true,
});

const ask = (question: string, hidden = false) =>
  new Promise<string>((resolve) => {
    process.stdout.write(question);
    muted = hidden;
    rl.question("", (answer) => {
      muted = false;
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });

const name = await ask("Nombre: ");
const email = await ask("Email: ");
const password = await ask("Contraseña (mínimo 8): ", true);
const confirm = await ask("Repite la contraseña: ", true);
rl.close();

if (!name || !email) throw new Error("Nombre y email son obligatorios");
if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres");
if (password !== confirm) throw new Error("Las contraseñas no coinciden");

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) throw new Error(`Ya existe un usuario con el email ${email}`);

const passwordHash = await bcrypt.hash(password, 10);
const user = await prisma.user.create({ data: { name, email, passwordHash } });

console.log(`Usuario creado: ${user.name} <${user.email}>`);
await prisma.$disconnect();
