# framework-init

CLI para crear proyectos desde templates. Instalás una vez y scaffoldás proyectos con un comando.

## Instalación

```bash
npm install -g framework-init
# o
bun add -g framework-init
```

## Uso

### Modo directo

```bash
framework-init fastify mi-api
framework-init aspnet mi-app
framework-init react-native mi-mobile
```

### Modo interactivo

```bash
framework-init
```

Te pregunta qué template usar y el nombre del proyecto.

### Ver templates disponibles

```bash
framework-init list
```

### Help

```bash
framework-init --help
```

## Templates disponibles

| Template | Descripción | Runtime |
|----------|-------------|---------|
| `aspnet` | API REST con ASP.NET Core, Clean Architecture y C# | dotnet |
| `express` | API REST con Express, Prisma, TypeScript y Bun | bun |
| `fastify` | API REST con Fastify, Prisma, TypeScript y Bun | bun |
| `nodejs` | API con Node.js puro, Prisma, TypeScript y tsx | node |
| `react-native` | App móvil con React Native, Expo y TypeScript | node |

## Qué hace

1. Descarga el ZIP del repositorio de templates desde GitHub
2. Extrae el template seleccionado
3. Lo copia al directorio del proyecto
4. Limpia los lock files (cada proyecto instala los suyos)
5. Te muestra los próximos pasos (install y dev)

## Desarrollo

```bash
bun install
bun run build        # build a dist/
bun run dev          # watch mode
bun run start        # ejecutar desde dist/
bun run typecheck    # type check
```

### Probar localmente

```bash
node dist/index.js list
node dist/index.js fastify mi-api
```

### Link global para desarrollo

```bash
bun link
# ahora `framework-init` está disponible en todo el sistema
```

## Licencia

MIT