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

## Páginas de consulta

Además del endpoint de carga, la aplicación expone dos páginas públicas que consumen los datos almacenados en PostgreSQL. Ambas se renderizan en el servidor y devuelven HTML, por lo que pueden enlazarse directamente con clientes o integrarse mediante un iframe firmado.

### `GET /orden`

Muestra el historial de fotos de una orden específica, separando ingreso (`ENTRY`) y salida (`EXIT`).

#### Query params

| Parámetro        | Tipo     | Requerido | Notas                                                                 |
|------------------|----------|-----------|-----------------------------------------------------------------------|
| `repairNumber`   | `string` | Sí        | Mismo formato que el formulario de carga (3-32 caracteres, letras/números/`-`/`_`/`.`). |

#### Respuesta

- Renderiza un formulario para ingresar el número de reparación y, cuando existe, dos galerías (Ingreso / Salida) ordenadas cronológicamente.
- Cuando no hay registros muestra un aviso y un acceso directo para completar `/upload`.
- Comparte enlaces permanentes, por ejemplo: `https://tudominio/orden?repairNumber=2458-2025`.

### `GET /gallery`

Lista todas las evidencias en orden cronológico inverso.

- No requiere parámetros, solo lee la tabla `Photo` ordenada por `createdAt DESC`.
- Cada tarjeta indica etapa (Ingreso/Salida), número de orden, técnico y comentarios si existen.
- La ruta se revalida cada vez que se realiza una carga nueva o se elimina una foto desde el panel interno.

## Revalidación incremental

Después de cada upload exitoso se ejecuta `revalidatePath` sobre `/gallery` y `/orden`, asegurando que la galería y la vista por orden reflejen los nuevos datos sin reiniciar el servidor.

## Versionado de la API

En este momento la API no tiene versionado explícito. Si se añaden endpoints adicionales se recomienda incorporar prefijos (`/api/v1/...`) o headers de versión para evitar regresiones.
