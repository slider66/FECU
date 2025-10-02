import nodemailer from "nodemailer";
import { Photo } from "@prisma/client";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

export async function sendMailWithPhotos(
    name: string,
    imageCount: number,
    photos: Photo[]
) {
    const photoHTML = photos
        .map(
            (photo) => `
            <div style="margin-bottom: 20px;">
                <img src="${photo.path}" 
                     alt="${photo.filename}" 
                     style="max-width: 250px; border-radius: 8px;" />
            </div>
        `
        )
        .join("");

    const mailOptions = {
        from: process.env.GOOGLE_EMAIL,
        to: process.env.GOOGLE_EMAIL,
        subject: `📸 ${name} har uploadet ${imageCount} billeder!`,
        html: `
            <h2>Nye bryllupsbillede(r)! 🎉</h2>
            <p><strong>${name}</strong> har uploadet ${imageCount} billeder!</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    
                        ${photoHTML}
    
                                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
    
             `,
    };
    await transporter.sendMail(mailOptions);
}
