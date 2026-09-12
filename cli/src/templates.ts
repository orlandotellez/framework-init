export type TemplateRuntime = "node" | "bun" | "dotnet";

export interface Template {
  name: string;
  alias: string[];
  description: string;
  folder: string;
  runtime: TemplateRuntime;
}

export const TEMPLATES: Template[] = [
  {
    name: "ASP.NET",
    alias: ["aspnet", "dotnet", "csharp"],
    description: "API REST con ASP.NET Core, Clean Architecture y C#",
    folder: "ASPNET",
    runtime: "dotnet",
  },
  {
    name: "Express",
    alias: ["express"],
    description: "API REST con Express, Prisma, TypeScript y Bun",
    folder: "EXPRESS",
    runtime: "bun",
  },
  {
    name: "Fastify",
    alias: ["fastify"],
    description: "API REST con Fastify, Prisma, TypeScript y Bun",
    folder: "FASTIFY",
    runtime: "bun",
  },
  {
    name: "Node.js Vanilla",
    alias: ["nodejs", "vanilla", "node"],
    description: "API con Node.js puro, Prisma, TypeScript y tsx",
    folder: "NODEJS-VANILLA",
    runtime: "node",
  },
  {
    name: "React Native",
    alias: ["react-native", "rn", "expo"],
    description: "App móvil con React Native, Expo y TypeScript",
    folder: "REACT-NATIVE",
    runtime: "node",
  },
];

export function findTemplate(input: string): Template | undefined {
  const normalized = input.toLowerCase().trim();
  return TEMPLATES.find(
    (t) =>
      t.folder.toLowerCase() === normalized ||
      t.alias.includes(normalized)
  );
}