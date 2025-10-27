/**
 * Carga datos de ejemplo en la tabla `Photo` para entornos de desarrollo.
 *
 * Uso sugerido:
 *   pnpm dlx tsx scripts/seed.ts
 */
import { PrismaClient, RepairStage } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seed de datos de prueba para FECU");

    const existing = await prisma.photo.count();
    if (existing > 0) {
        console.warn(
            `⚠️  La tabla ya contiene ${existing} registros. No se insertaron duplicados.`
        );
        return;
    }

    const now = new Date();
    const photos = [
        {
            filename: "ingreso-frontal.jpg",
            path: "https://example.supabase.co/storage/v1/object/public/repair-photos/example-ingreso-frontal.jpg",
            repairNumber: "DEV-1000",
            stage: RepairStage.ENTRY,
            bucketPath: "repair-photos/example-ingreso-frontal.jpg",
            fileSize: 450_000,
            mimeType: "image/jpeg",
            technician: "Dev Tester",
            comments: "Evidencia inicial",
            createdAt: now,
        },
        {
            filename: "salida-frontal.jpg",
            path: "https://example.supabase.co/storage/v1/object/public/repair-photos/example-salida-frontal.jpg",
            repairNumber: "DEV-1000",
            stage: RepairStage.EXIT,
            bucketPath: "repair-photos/example-salida-frontal.jpg",
            fileSize: 430_000,
            mimeType: "image/jpeg",
            technician: "Dev Tester",
            comments: "Equipo entregado sin daños nuevos",
            createdAt: now,
        },
    ];

    await prisma.photo.createMany({ data: photos });
    console.log(`✅ Insertados ${photos.length} registros de ejemplo.`);
}

main()
    .catch((error) => {
        console.error("❌ Error al ejecutar seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
