# Base de Datos

FECU utiliza **PostgreSQL** gestionado mediante **Prisma ORM**. El esquema actual se centra en la entidad `Photo`, que almacena metadatos de cada imagen subida. Las imágenes en sí viven en Supabase Storage.

## Esquema

```prisma
enum RepairStage {
  ENTRY
  EXIT
}

model Photo {
  id           String   @id @default(cuid())
  filename     String
  path         String
  createdAt    DateTime @default(now())
  repairNumber String
  stage        RepairStage
  bucketPath   String   @unique
  fileSize     Int?
  mimeType     String?
  technician   String?
  comments     String?

  @@map("photos")
}
```

| Campo         | Tipo        | Descripción                                               |
|---------------|-------------|-----------------------------------------------------------|
| `id`          | `String`    | Identificador único (CUID).                               |
| `filename`    | `String`    | Nombre original del archivo enviado por el cliente.      |
| `path`        | `String`    | URL pública del archivo en Supabase Storage.             |
| `createdAt`   | `DateTime`  | Fecha/hora de creación.                                   |
| `repairNumber`| `String`    | Número de reparación usado como llave de agrupamiento.   |
| `stage`       | `RepairStage` | Etapa del flujo: `ENTRY` o `EXIT`.                     |
| `bucketPath`  | `String`    | Ruta exacta en el bucket (única para evitar duplicados). |
| `fileSize`    | `Int?`      | Tamaño del archivo en bytes (opcional).                  |
| `mimeType`    | `String?`   | MIME type detectado (`image/jpeg`, etc.).                |
| `technician`  | `String?`   | Técnico que registró la carga.                           |
| `comments`    | `String?`   | Notas opcionales del técnico.                            |

## Relaciones

Actualmente no existen relaciones con otras tablas. El diseño permite incorporar entidades futuras (p. ej. `RepairOrder`, `Technician`) y vincularlas mediante claves foráneas.

## Migraciones

- Las migraciones viven en `prisma/migrations/`.
- Ejecutar `pnpm exec prisma migrate dev` para generar cambios durante el desarrollo.
- Para entornos productivos usar `pnpm exec prisma migrate deploy` (ver `scripts/migrate.ts`).

## Consultas comunes

- Fotos para una orden: `prisma.photo.findMany({ where: { repairNumber } })`.
- Diferenciar ingreso/salida: filtrar por `stage`.
- Orden cronológico: ordenar por `createdAt` descendente.

## Próximos pasos sugeridos

- Crear índices secundarios en `repairNumber` y `stage` si el tráfico crece.
- Normalizar técnicos/ordenes en tablas dedicadas para reportes avanzados.
- Registrar soft deletes (`deletedAt`) si se requiere auditoría completa.
