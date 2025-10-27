/**
 * Ejecuta la secuencia básica de migraciones con Prisma.
 *
 * Uso sugerido:
 *   pnpm dlx tsx scripts/migrate.ts
 */
import { spawn } from "node:child_process";

function run(command: string, args: string[]) {
    return new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: "inherit",
            shell: process.platform === "win32",
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
            }
        });
    });
}

async function main() {
    console.log("🔄 Generando cliente de Prisma...");
    await run("pnpm", ["exec", "prisma", "generate"]);

    console.log("📦 Aplicando migraciones...");
    await run("pnpm", ["exec", "prisma", "migrate", "deploy"]);

    console.log("✅ Migraciones completas.");
}

main().catch((error) => {
    console.error("❌ Error al ejecutar migraciones:", error);
    process.exit(1);
});
