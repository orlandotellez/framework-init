# framework-init

Repositorio de templates para scaffoldear proyectos con [framework-init CLI](https://github.com/orlandotellez/framework-init).

## Templates Disponibles

| Template | Descripción | Runtime |
|----------|-------------|---------|
| `aspnet` | API REST con ASP.NET Core, Clean Architecture y C# | dotnet |
| `express` | API REST con Express, Prisma, TypeScript y Bun | bun |
| `fastify` | API REST con Fastify, Prisma, TypeScript y Bun | bun |
| `nodejs` | API con Node.js puro, Prisma, TypeScript y tsx | node |
| `react-native` | App móvil con React Native, Expo y TypeScript | node |

## Uso con CLI

```bash
# Instalar la CLI
npm install -g framework-init

# Crear proyecto desde template
framework-init fastify mi-api
framework-init aspnet mi-app
framework-init react-native mi-mobile

# Ver templates disponibles
framework-init list
```

## Uso Directo (sin CLI)

Si preferís clonar directamente:

```bash
git clone https://github.com/orlandotellez/framework-init.git
cd framework-init/FASTIFY
# Copiar los archivos a tu proyecto
```

## Estructura

```
framework-init/
├── ASPNET/              # ASP.NET Core + Clean Architecture
├── EXPRESS/             # Express + Prisma + TypeScript
├── FASTIFY/             # Fastify + Prisma + TypeScript
├── NODEJS-VANILLA/      # Node.js puro + Prisma + TypeScript
├── REACT-NATIVE/        # React Native + Expo
└── propuesta.md         # Documentación de la CLI
```

## Cada template incluye

- `template.json` — Metadatos para la CLI
- `.env.example` — Variables de entorno de ejemplo
- `.gitignore` — Archivos excluidos del tracking
- Código fuente listo para usar

## Licencia

MIT
