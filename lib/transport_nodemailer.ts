import nodemailer from "nodemailer";
import { Photo, RepairStage } from "@prisma/client";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

/**
 * Sends an internal notification email including metadata and thumbnails for a repair order.
 *
 * @param repairNumber - External identifier for the repair order.
 * @param stage - Workflow stage (`ENTRY` or `EXIT`) associated with the upload.
 * @param imageCount - Total number of photos uploaded in the request.
 * @param photos - Persisted `Photo` records used to render thumbnails and metadata.
 * @param technician - Optional technician name responsible for the upload.
 * @param comments - Optional notes entered alongside the upload.
 */
export async function sendMailWithPhotos(
    repairNumber: string,
    stage: RepairStage,
    imageCount: number,
    photos: Photo[],
    technician?: string | null,
    comments?: string | null
) {
    if (!process.env.GOOGLE_EMAIL || !process.env.GOOGLE_APP_PASSWORD) {
        return;
    }

    const stageLabel = stage === "ENTRY" ? "Ingreso" : "Salida";
    const technicianInfo = technician
        ? `<p>Tecnico: <strong>${technician}</strong></p>`
        : "";
    const commentsInfo = comments
        ? `<p>Comentarios: <em>${comments}</em></p>`
        : "";
    const photoHTML = photos
        .map(
            (photo) => `
            <div style="margin-bottom: 16px;">
                <img src="${photo.path}"
                     alt="${photo.filename}"
                     style="max-width: 240px; border-radius: 8px;" />
                <p style="font-size: 12px; color: #555; margin-top: 4px;">
                    Archivo: ${photo.filename}
                </p>
            </div>
        `
        )
        .join("");

    const mailOptions = {
        from: process.env.GOOGLE_EMAIL,
        to: process.env.GOOGLE_EMAIL,
        subject: `Orden ${repairNumber} - ${stageLabel} (${imageCount} fotos)`,
        html: `
            <h2>Nuevo registro de ${stageLabel.toLowerCase()}</h2>
            <p>Orden: <strong>${repairNumber}</strong></p>
            ${technicianInfo}
            ${commentsInfo}
            <p>Total de imagenes: <strong>${imageCount}</strong></p>
            <hr style="border: 1px solid #eee; margin: 16px 0;" />
            ${photoHTML}
            <hr style="border: 1px solid #eee; margin: 16px 0;" />
        `,
    };

    await transporter.sendMail(mailOptions);
}
