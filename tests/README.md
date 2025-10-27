# Tests

La carpeta `tests/` se divide en tres niveles:

- `unit/`: pruebas unitarias para utilidades, hooks y componentes puros.
- `integration/`: validaciones que ejercitan múltiples piezas (p. ej. API Routes).
- `e2e/`: flujos de extremo a extremo. Recomendado usar Playwright o Cypress.

Pendiente de configuración: elegir un test runner. Sugerencia inicial:

```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

Documenta en cada subcarpeta el criterio para las pruebas que agregues y mantén los fixtures en `tests/fixtures/`.
