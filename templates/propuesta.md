# Propuesta: CLI Framework-Init

## Visión General

Crear una CLI que permita scaffoldear proyectos desde las plantillas almacenadas en este repositorio. El usuario instala una vez y luego ejecuta comandos como:

```bash
framework-init fastify mi-api
framework-init aspnet mi-app
framework-init list
```

## Arquitectura Decidida

### Estructura del CLI

```
framework-init/
├── src/
│   ├── index.ts          # Entry point y lógica principal
│   ├── templates.ts      # Definición de plantillas disponibles
│   ├── downloader.ts     # Descarga y extracción de ZIP
│   ├── prompts.ts        # Interacción con el usuario
│   └── utils.ts          # Utilidades (paths, validación, etc.)
├── package.json
├── tsconfig.json
├── tsup.config.ts        # Bundler para CLI
└── README.md
```

### Flujo del Usuario

```
framework-init
```

**Modo interactivo:**
```
? ¿Qué proyecto quieres crear?
❯ ASP.NET
  Express
  Fastify
  Node.js Vanilla
  React Native

? Nombre del proyecto: mi-api

Creating project "mi-api" from Fastify template...
✔ Template downloaded
✔ Project created in ./mi-api

Next steps:
  cd mi-api
  bun install
  bun dev
```

**Modo directo:**
```bash
framework-init fastify mi-api
framework-init list
framework-init --help
```

## Paso a Paso de Implementación

### Fase 1: Preparación del Repositorio de Plantillas

**1.1 Crear un .gitignore en la raíz del repo que excluya:**
```gitignore
# Dependencias (no incluir en templates)
node_modules/
dist/
build/
.env
*.lock
bun.lock
pnpm-lock.yaml
package-lock.json
yarn.lock

# Archivos de IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

**1.2 Crear una estructura consistente en cada template:**

Cada carpeta de template debe tener:
- `template.json` — Metadata del template (nombre, descripción, dependencias, comandos post-init)
- `README.md` — Instrucciones específicas del template
- Código fuente limpio (sin node_modules, sin dist, sin locks)

**1.3 Ejemplo de `template.json` para FASTIFY:**
```json
{
  "name": "fastify",
  "description": "API REST con Fastify, Prisma y TypeScript",
  "version": "1.0.0",
  "postInit": {
    "install": "bun install",
    "dev": "bun dev",
    "build": "bun build"
  },
  "dependencies": {
    "runtime": "bun",
    "database": "prisma"
  }
}
```

### Fase 2: Configuración del Proyecto CLI

**2.1 Inicializar el proyecto:**
```bash
mkdir framework-init-cli
cd framework-init-cli
bun init -y
```

**2.2 Configurar `package.json`:**
```json
{
  "name": "framework-init",
  "version": "1.0.0",
  "description": "CLI para crear proyectos desde templates",
  "type": "module",
  "bin": {
    "framework-init": "./dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --watch",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "inquirer": "^9.2.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "adm-zip": "^0.5.10"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/adm-zip": "^0.5.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },
  "keywords": ["cli", "templates", "scaffolding"],
  "author": "Orlando Téllez",
  "license": "MIT"
}
```

**2.3 Configurar `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### Fase 3: Implementación del Core

**3.1 `src/templates.ts` — Definición de plantillas:**
```typescript
export interface Template {
  name: string;
  alias: string[];
  description: string;
  folder: string;
}

export const TEMPLATES: Template[] = [
  {
    name: "ASP.NET",
    alias: ["aspnet", "dotnet", "csharp"],
    description: "API con ASP.NET Core y C#",
    folder: "ASPNET",
  },
  {
    name: "Express",
    alias: ["express"],
    description: "API REST con Express y TypeScript",
    folder: "EXPRESS",
  },
  {
    name: "Fastify",
    alias: ["fastify"],
    description: "API REST con Fastify, Prisma y TypeScript",
    folder: "FASTIFY",
  },
  {
    name: "Node.js Vanilla",
    alias: ["nodejs", "vanilla", "node"],
    description: "API con Node.js puro y TypeScript",
    folder: "NODEJS-VANILLA",
  },
  {
    name: "React Native",
    alias: ["react-native", "rn", "expo"],
    description: "App móvil con React Native y Expo",
    folder: "REACT-NATIVE",
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
```

**3.2 `src/downloader.ts` — Descarga de templates:**
```typescript
import AdmZip from "adm-zip";
import { mkdir, writeFile, rm, cp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

const GITHUB_REPO = "orlandotellez/framework-init";
const GITHUB_BRANCH = "main";

export async function downloadTemplate(
  templateFolder: string
): Promise<string> {
  const url = `https://github.com/${GITHUB_REPO}/archive/refs/heads/${GITHUB_BRANCH}.zip`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download template: ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const zip = new AdmZip(buffer);

  const tempDir = join(
    tmpdir(),
    `framework-init-${randomBytes(8).toString("hex")}`
  );
  await mkdir(tempDir, { recursive: true });

  zip.extractAllTo(tempDir, true);

  // El ZIP extrae como: framework-init-main/ASPNET/
  const extractedRoot = join(tempDir, `framework-init-${GITHUB_BRANCH}`);
  const templatePath = join(extractedRoot, templateFolder);

  return templatePath;
}

export async function copyTemplate(
  source: string,
  destination: string
): Promise<void> {
  await cp(source, destination, { recursive: true });
}

export async function cleanupTemp(tempDir: string): Promise<void> {
  await rm(tempDir, { recursive: true, force: true });
}
```

**3.3 `src/prompts.ts` — Interacción con el usuario:**
```typescript
import inquirer from "inquirer";
import { TEMPLATES, Template } from "./templates.js";

export async function selectTemplate(): Promise<Template> {
  const { template } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "¿Qué proyecto quieres crear?",
      choices: TEMPLATES.map((t) => ({
        name: `${t.name} — ${t.description}`,
        value: t,
      })),
    },
  ]);
  return template;
}

export async function askProjectName(): Promise<string> {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Nombre del proyecto:",
      validate: (input) => {
        if (!input.trim()) return "El nombre no puede estar vacío";
        if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
          return "Solo letras, números, guiones y guiones bajos";
        }
        return true;
      },
    },
  ]);
  return name.trim();
}
```

**3.4 `src/utils.ts` — Utilidades:**
```typescript
import { existsSync } from "fs";
import { resolve } from "path";

export function getProjectPath(name: string): string {
  return resolve(process.cwd(), name);
}

export function projectExists(name: string): boolean {
  return existsSync(getProjectPath(name));
}

export function printSuccess(projectName: string, templateName: string): void {
  console.log(`
\x1b[32m✔\x1b[0m Template downloaded
\x1b[32m✔\x1b[0m Project created in ./${projectName}

\x1b[1mNext steps:\x1b[0m

  \x1b[36mcd ${projectName}\x1b[0m
  \x1b[36mbun install\x1b[0m
  \x1b[36mbun dev\x1b[0m
`);
}
```

**3.5 `src/index.ts` — Entry point:**
```typescript
#!/usr/bin/env node

import { Command } from "commander";
import ora from "ora";
import { TEMPLATES, findTemplate } from "./templates.js";
import { downloadTemplate, copyTemplate, cleanupTemp } from "./downloader.js";
import { selectTemplate, askProjectName } from "./prompts.js";
import {
  getProjectPath,
  projectExists,
  printSuccess,
} from "./utils.js";

const program = new Command();

program
  .name("framework-init")
  .description("CLI para crear proyectos desde templates")
  .version("1.0.0");

program
  .command("list")
  .description("Mostrar templates disponibles")
  .action(() => {
    console.log("\n\x1b[1mAvailable templates:\x1b[0m\n");
    TEMPLATES.forEach((t) => {
      console.log(`  \x1b[36m${t.folder.toLowerCase()}\x1b[0m — ${t.description}`);
    });
    console.log();
  });

program
  .argument("[template]", "Template a usar")
  .argument("[project-name]", "Nombre del proyecto")
  .action(async (templateArg?: string, projectNameArg?: string) => {
    try {
      let template = templateArg ? findTemplate(templateArg) : undefined;
      let projectName = projectNameArg;

      // Si no se dio template, modo interactivo
      if (!template) {
        template = await selectTemplate();
      }

      if (!template) {
        console.error(
          `\x1b[31m✖\x1b[0m Template "${templateArg}" not found.\n`
        );
        console.log("Available templates:");
        TEMPLATES.forEach((t) => console.log(`  - ${t.folder.toLowerCase()}`));
        process.exit(1);
      }

      // Si no se dio nombre, preguntar
      if (!projectName) {
        projectName = await askProjectName();
      }

      // Verificar si ya existe
      if (projectExists(projectName)) {
        console.error(
          `\x1b[31m✖\x1b[0m Directory "${projectName}" already exists.`
        );
        process.exit(1);
      }

      // Descargar y crear
      const spinner = ora(
        `Downloading ${template.name} template...`
      ).start();

      const tempPath = await downloadTemplate(template.folder);
      spinner.text = "Creating project...";

      await copyTemplate(tempPath, getProjectPath(projectName));
      await cleanupTemp(tempPath.split(template.folder)[0]);

      spinner.succeed("Template downloaded");

      printSuccess(projectName, template.name);
    } catch (error) {
      console.error(`\x1b[31m✖\x1b[0m Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
```

### Fase 4: Build y Publicación

**4.1 Instalar dependencias:**
```bash
bun install
```

**4.2 Build:**
```bash
bun run build
```

**4.3 Probar localmente:**
```bash
# Desde la carpeta del CLI
node dist/index.js list
node dist/index.js fastify mi-api
```

**4.4 Instalar globalmente (desarrollo):**
```bash
bun link
# Ahora puedes usar framework-init desde cualquier lugar
```

**4.5 Publicar en npm:**
```bash
npm login
npm publish
```

### Fase 5: Experiencia del Usuario Final

**Instalación:**
```bash
npm install -g framework-init
# o
bun add -g framework-init
```

**Uso interactivo:**
```bash
framework-init
? ¿Qué proyecto quieres crear? Fastify
? Nombre del proyecto: mi-api
```

**Uso directo:**
```bash
framework-init fastify mi-api
framework-init aspnet mi-app
framework-init list
```

**Help:**
```bash
framework-init --help

Usage: framework-init [options] [template] [project-name]

CLI para crear proyectos desde templates

Arguments:
  template                Template a usar
  project-name            Nombre del proyecto

Options:
  -V, --version           output the version number
  -h, --help              display help for command

Commands:
  list                    Mostrar templates disponibles

Examples:
  framework-init fastify my-api
  framework-init aspnet my-app
  framework-init list
```

## Checklist de Implementación

- [ ] **Preparar repositorio de templates**
  - [ ] Limpiar node_modules, dist, locks de cada template
  - [ ] Agregar template.json a cada carpeta
  - [ ] Actualizar .gitignore raíz
  - [ ] Crear README.md descriptivo

- [ ] **Crear proyecto CLI**
  - [ ] Inicializar proyecto con bun
  - [ ] Configurar package.json con bin
  - [ ] Configurar tsconfig.json
  - [ ] Configurar tsup

- [ ] **Implementar funcionalidad core**
  - [ ] Definición de templates (templates.ts)
  - [ ] Descarga de ZIP (downloader.ts)
  - [ ] Prompts interactivos (prompts.ts)
  - [ ] Utilidades (utils.ts)
  - [ ] Entry point (index.ts)

- [ ] **Testing**
  - [ ] Probar modo interactivo
  - [ ] Probar comandos directos
  - [ ] Probar list
  - [ ] Probar errores (template no existe, directorio ya existe)

- [ ] **Publicación**
  - [ ] Build exitoso
  - [ ] Publicar en npm
  - [ ] Verificar instalación global

## Decisiones Técnicas

| Decisión | Elección | Por qué |
|----------|----------|---------|
| Runtime | Bun | Más rápido, ya lo usas en los templates |
| Bundler | tsup | Simple, funciona bien para CLIs |
| Prompts | inquirer | El estándar, bien mantenido |
| Descarga | ZIP from GitHub | No necesita git instalado |
| Colors | chalk | El más popular para CLIs |
| Spinner | ora | Animaciones de progreso |

## Notas Importantes

1. **El ZIP de GitHub incluye todo el repo** — Hay que filtrar solo la carpeta del template
2. **Los templates no deben tener node_modules** — Se excluyen en .gitignore
3. **Post-init hooks** — Podemos ejecutar `bun install` automáticamente después de crear el proyecto
4. **Cache local** — Futura mejora: cachear el ZIP descargado para no descargar cada vez

---

**¿Empezamos?**
