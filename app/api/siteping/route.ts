import { createSitepingHandler } from "@siteping/adapter-prisma";
import { prisma } from "@/lib/prisma";

const origins = (process.env.SITEPING_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const { GET, POST, PATCH, DELETE, OPTIONS } = createSitepingHandler({
  prisma,
  allowedOrigins: origins,
  apiKey: process.env.SITEPING_API_KEY,
});
