# fwinit

Repositorio de templates para scaffoldear proyectos con [fwinit CLI](https://github.com/orlandotellez/fwinit).

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
npm install -g fwinit

# Crear proyecto desde template
fwinit fastify mi-api
fwinit aspnet mi-app
fwinit react-native mi-mobile

# Ver templates disponibles
fwinit list
```

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

## Licencia

MIT
