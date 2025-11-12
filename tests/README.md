# Tests

El proyecto usa **Vitest + Testing Library** para ejecutar las suites desde la carpeta `tests/`.

## Estructura

- `unit/`: pruebas unitarias para utilidades, hooks y componentes puros.
- `integration/`: validaciones que ejercitan múltiples piezas (p. ej. API Routes).
- `e2e/`: flujos de extremo a extremo (configura Playwright/Cypress dentro de esta carpeta cuando se necesite).
- `setup/`: inicializadores compartidos (por ejemplo `vitest.setup.ts` que importa `@testing-library/jest-dom`).

Mantén los fixtures dentro de `tests/fixtures/` y documenta en cada subcarpeta el criterio de las pruebas que agregues.

## Comandos disponibles

```bash
pnpm test        # Ejecuta Vitest en modo run (uso en CI)
pnpm test:watch  # Ejecuta Vitest en watch mode con UI interactiva
```

Vitest está configurado en `vitest.config.ts` para usar `jsdom`, rutas con el alias `@/` y el setup global de Testing Library.

## Ejemplo mínimo

Como referencia, `tests/unit/lib/utils.test.ts` valida la utilidad `cn` de `lib/utils.ts`. Usa este patrón para cubrir componentes UI (render con `@testing-library/react`) o funciones de negocio.
