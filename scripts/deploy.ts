/**
 * Automatiza el flujo de despliegue para entornos productivos.
 *
 * Uso sugerido:
 *   pnpm dlx tsx scripts/deploy.ts
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
                reject(new Error(`${command} ${args.join(" ")} finalizo con codigo ${code}`));
            }
        });
    });
}

async function main() {
    console.log("Instalando dependencias con pnpm...");
    await run("pnpm", ["install", "--frozen-lockfile"]);

    console.log("Generando cliente Prisma...");
    await run("pnpm", ["exec", "prisma", "generate"]);

    console.log("Aplicando migraciones...");
    await run("pnpm", ["exec", "prisma", "migrate", "deploy"]);

    console.log("Construyendo artefactos de produccion...");
    await run("pnpm", ["build"]);

    console.log("Flujo de despliegue completado.");
}

main().catch((error) => {
    console.error("Error durante el despliegue:", error);
    process.exit(1);
});
