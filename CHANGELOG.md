# Registro de cambios

Todos los cambios relevantes de este proyecto se documentarán en este archivo.

El formato sigue la guía de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado respeta [Semantic Versioning](https://semver.org/lang/es/spec/v2.0.0.html).

## [0.2.0] - 2025-11-27

### Añadido
- **Rebranding**: Cambio de identidad visual y textos para "Bautizo Iago".
- **Optimización de Subida**:
    - Compresión de imágenes en el cliente (Canvas API).
    - Inserción masiva en base de datos (`createMany`).
    - Barra de progreso visual y protección `Wake Lock`.
- **Seguridad**:
    - Eliminación de credenciales hardcodeadas.
    - Corrección de autenticación en panel de administración.
- **UI/UX**:
    - Botón "Volver al inicio" en galería.
    - Navegación mejorada en móviles.

## [0.1.0] - 2024-01-01

- Versión inicial (FECU - Control de Reparaciones).
- Estructura inicial de documentación: arquitectura, API, base de datos, despliegue, contribución y solución de problemas.
- Se añadieron carpetas base para pruebas, scripts y flujo de GitHub Actions.
- Se publicaron las plantillas de variables de entorno y la licencia MIT.
