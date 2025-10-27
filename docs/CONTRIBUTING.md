# Guía de contribución

¡Gracias por tu interés en contribuir a FECU! Este documento describe el flujo de trabajo recomendado para mantener un repositorio ordenado y consistente.

## Código de conducta

- Trata a todas las personas con respeto.
- No compartas credenciales ni datos sensibles en issues, commits o PRs.
- Si detectas un comportamiento inapropiado, avisa a los administradores del proyecto.

## Flujo de trabajo

1. Crea un fork o una rama basada en `main`.
2. Abre un issue describiendo el problema/feature si aún no existe.
3. Implementa los cambios siguiendo los lineamientos de estilo.
4. Ejecuta `pnpm lint` y las pruebas disponibles antes de subir cambios.
5. Envía una Pull Request (PR) enlazando el issue relacionado y detalla los cambios.

## Convenciones de commits

Se recomienda el formato [Conventional Commits](https://www.conventionalcommits.org):

```
tipo[scope]: descripción breve
```

Ejemplos:

- `feat(upload): permitir arrastrar y soltar imágenes`
- `fix(api): validar tamaño máximo antes de subir a supabase`
- `docs: agregar guía de despliegue`

## Estilo de código

- Usa TypeScript y sigue las reglas de `eslint.config.mjs`.
- Mantén el código auto-documentado; agrega comentarios solo cuando sea necesario.
- Prefiere funciones puras y componentes pequeños y reutilizables.
- Evita introducir dependencias innecesarias.

## Pruebas

- Las carpetas de pruebas se organizan en `tests/unit`, `tests/integration` y `tests/e2e`.
- Utiliza `pnpm test` (pendiente de configuración) o el runner que se defina más adelante.
- Al agregar una feature o corregir un bug, incluye pruebas que cubran el caso.

## Revisión de PRs

- Explica en la descripción qué se resolvió, cómo se probó y cualquier riesgo.
- Adjunta capturas o GIFs si el cambio modifica la UI.
- Un revisor deberá aprobar la PR antes del merge.

## Lanzamientos

- Actualiza `CHANGELOG.md` con cada cambio relevante.
- Taggea versiones siguiendo SemVer (`vMAJOR.MINOR.PATCH`).
- Documenta breaking changes y pasos de actualización.

## Contacto

Si tienes preguntas, abre un issue o contacta a los mantenedores del proyecto directamente.
