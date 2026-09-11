# fwinit

![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![.NET 10](https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)

Repositorio de templates para scaffoldear proyectos con [fwinit CLI](https://github.com/orlandotellez/fwinit).

## Instalación de la CLI

```bash
# pnpm (recomendado)
pnpm add -g fwinit

# npm
npm install -g fwinit

# bun
bun add -g fwinit
```

## Uso

```bash
# Crear proyecto desde template
fwinit fastify mi-api
fwinit aspnet mi-app
fwinit react-native mi-mobile

# Ver templates disponibles
fwinit list
```

También podés usar el modo interactivo:

```bash
fwinit
```

Te pregunta qué template usar y el nombre del proyecto.

## Templates disponibles

| Template | Descripción | Runtime |
|----------|-------------|---------|
| `aspnet` | API REST con ASP.NET Core, Clean Architecture y C# | dotnet |
| `express` | API REST con Express, Prisma, TypeScript y Bun | bun |
| `fastify` | API REST con Fastify, Prisma, TypeScript y Bun | bun |
| `nodejs` | API con Node.js puro, Prisma, TypeScript y tsx | node |
| `react-native` | App móvil con React Native, Expo y TypeScript | node |

## Uso Directo (sin CLI)

Si preferís clonar directamente:

```bash
git clone https://github.com/orlandotellez/fwinit.git
cd fwinit/templates/FASTIFY
# Copiar los archivos a tu proyecto
```

## Estructura

```
fwinit/
├── cli/                 # Fuente de la fwinit CLI
│   ├── src/
│   └── package.json
├── templates/
│   ├── ASPNET/          # ASP.NET Core + Clean Architecture
│   ├── EXPRESS/         # Express + Prisma + TypeScript
│   ├── FASTIFY/         # Fastify + Prisma + TypeScript
│   ├── NODEJS-VANILLA/  # Node.js puro + Prisma + TypeScript
│   └── REACT-NATIVE/    # React Native + Expo
└── README.md
```

## Cada template incluye

- `template.json` — Metadatos para la CLI
- `.env.example` — Variables de entorno de ejemplo
- `.gitignore` — Archivos excluidos del tracking
- Código fuente listo para usar

## Solución a problemas comunes

### pnpm: "Unable to find the global bin directory"

pnpm no tiene configurado el directorio global. Corré esto una vez:

```bash
pnpm setup
source ~/.bashrc  # o reiniciá la terminal
```

### bun: "add the global bin folder to $PATH"

bun se instaló pero falta agregar su directorio al PATH. Agregalo a tu `.bashrc` o `.zshrc`:

```bash
export PATH="$HOME/.bun/bin:$PATH"
```

Después reiniciá la terminal o corré `source ~/.bashrc`.

## Licencia

MIT
