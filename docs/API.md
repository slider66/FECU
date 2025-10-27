# API

Actualmente la aplicación expone un único endpoint público que recibe cargas fotográficas. Todos los endpoints usan JSON en las respuestas y `multipart/form-data` cuando se envían archivos.

## Autenticación

No hay autenticación integrada. Si el proyecto evoluciona para uso externo, se recomienda agregar un token de servicio, API Keys o autenticación de usuario antes de exponer el endpoint.

## Endpoints

### `POST /api/photos`

Recibe la carga de imágenes por orden de reparación.

#### Headers

- `Content-Type: multipart/form-data` (se genera automáticamente al usar formularios HTML estándar).

#### Campos del formulario

| Campo          | Tipo                  | Requerido | Notas                                                                 |
|----------------|-----------------------|----------|-----------------------------------------------------------------------|
| `repairNumber` | `string`              | Sí       | Acepta letras, números, `-`, `_`, `.`; entre 3 y 32 caracteres.       |
| `stage`        | `ENTRY` \| `EXIT`     | Sí       | Determina si la carga corresponde al ingreso o la salida.             |
| `technician`   | `string`              | No       | Nombre del técnico que registró la evidencia (máx. 48 caracteres).    |
| `comments`     | `string`              | No       | Observaciones adicionales (máx. 400 caracteres).                      |
| `images[]`     | `File` (1..12)        | Sí       | Extensiones: jpeg, jpg, png, webp, heic, heif. Tamaño máx. 8 MB c/u.  |

#### Respuesta exitosa (`200 OK`)

```json
{
  "message": "Se guardaron 3 fotos para la orden 1234 (ingreso).",
  "repairNumber": "1234",
  "stage": "ENTRY",
  "technician": "Ana Perez",
  "comments": "Golpe en lateral derecho",
  "imageCount": 3,
  "photos": [
    {
      "id": "clz...",
      "filename": "IMG_0001.jpg",
      "path": "https://...supabase.co/storage/v1/object/public/repair-photos/1234-ENTRY-...",
      "repairNumber": "1234",
      "stage": "ENTRY",
      "bucketPath": "repair-photos/1234-ENTRY-...",
      "fileSize": 7340032,
      "mimeType": "image/jpeg",
      "technician": "Ana Perez",
      "comments": "Golpe en lateral derecho",
      "createdAt": "2025-10-27T22:47:55.533Z"
    }
  ]
}
```

#### Respuestas de error

| Código | Motivo                                                     |
|--------|------------------------------------------------------------|
| `400`  | Falta `repairNumber`, `stage` inválido o ausencia de fotos.|
| `500`  | Error interno al subir archivos o escribir en la base.     |

Los mensajes de error vienen formateados como:

```json
{ "message": "Descripción del error" }
```

#### Ejemplo `curl`

```bash
curl -X POST http://localhost:3000/api/photos \
  -F repairNumber=1234 \
  -F stage=ENTRY \
  -F technician="Ana Perez" \
  -F comments="Daños en carcasa" \
  -F images[]=@./fixtures/front.jpg \
  -F images[]=@./fixtures/back.jpg
```

## Revalidación incremental

Después de cada upload exitoso se ejecuta `revalidatePath` sobre `/gallery` y `/orden`, asegurando que la galería y la vista por orden reflejen los nuevos datos sin reiniciar el servidor.

## Versionado de la API

En este momento la API no tiene versionado explícito. Si se añaden endpoints adicionales se recomienda incorporar prefijos (`/api/v1/...`) o headers de versión para evitar regresiones.
