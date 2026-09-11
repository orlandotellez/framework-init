# fwinit

CLI para crear proyectos desde templates. Instalás una vez y scaffoldás proyectos con un comando.

## Instalación

```bash
# pnpm (recomendado)
pnpm add -g fwinit

# npm
npm install -g fwinit

# bun
bun add -g fwinit
```

## Uso

### Modo directo

```bash
fwinit fastify mi-api
fwinit aspnet mi-app
fwinit react-native mi-mobile
```

### Modo interactivo

```bash
fwinit
```

Te pregunta qué template usar y el nombre del proyecto.

### Ver templates disponibles

```bash
fwinit list
```

### Help

```bash
fwinit --help
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
# pnpm (recomendado)
pnpm install
pnpm run build        # build a dist/
pnpm run dev          # watch mode
pnpm run start        # ejecutar desde dist/
pnpm run typecheck    # type check

# npm
npm install
npm run build
npm run dev
npm run start
npm run typecheck

# bun
bun install
bun run build
bun run dev
bun run start
bun run typecheck
```

### Probar localmente

```bash
node dist/index.js list
node dist/index.js fastify mi-api
```

### Link global para desarrollo

```bash
# pnpm (recomendado)
pnpm link --global

# npm
npm link

# bun
bun link
```

Ahora `fwinit` está disponible en todo el sistema.

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