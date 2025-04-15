import { existsSync } from "fs"
import path from "path"
import nodemailer from "nodemailer"

// Konfigurer transporter
let transporter: nodemailer.Transporter | null = null

// Forsøg at oprette en nodemailer transporter
try {
  // Kun opret transporter hvis både bruger og adgangskode er angivet
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    console.log("Nodemailer transporter oprettet med succes")
  } else {
    console.warn(
      "Email credentials mangler. E-mail funktionalitet er deaktiveret."
    )
  }
} catch (error) {
  console.error("Fejl ved oprettelse af nodemailer transporter:", error)
}

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
  attachments?: Array<{
    filename: string
    path?: string
    href?: string
  }>
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Tjek om transporter er oprettet
  if (!transporter) {
    console.warn(
      "Nodemailer transporter er ikke konfigureret. E-mail blev ikke sendt."
    )
    return
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    ...options,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email sendt til:", options.to)
  } catch (error) {
    let errorMessage = "Ukendt fejl ved afsendelse af e-mail"

    if (error instanceof Error) {
      // Håndter specifikke fejl
      if (error.message.includes("Username and Password not accepted")) {
        errorMessage =
          "Gmail login fejlede. Kontroller at du bruger en app-adgangskode, ikke din almindelige adgangskode."
      } else if (error.message.includes("Invalid login")) {
        errorMessage =
          "Ugyldig login til e-mail. Tjek din e-mail og adgangskode."
      } else if (error.message.includes("Error: self signed certificate")) {
        errorMessage = "SSL certifikat fejl ved forbindelse til e-mail server."
      } else {
        errorMessage = `E-mail fejl: ${error.message}`
      }
    }

    console.error("Fejl ved afsendelse af e-mail:", errorMessage)
    throw new Error(errorMessage)
  }
}

export async function sendPhotoNotification(
  photoUrl: string,
  uploadedBy?: string
): Promise<void> {
  // Hvis transporter ikke er konfigureret, hop over e-mail
  if (!transporter) {
    console.warn(
      "E-mail notifikation blev sprunget over, fordi transporter ikke er konfigureret"
    )
    return
  }

  const to = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || ""
  if (!to) {
    console.warn("Ingen modtager-e-mail angivet. E-mail blev ikke sendt.")
    return
  }

  console.log(`Sender e-mail notifikation til: ${to}`)

  const uploaderInfo = uploadedBy ? ` fra ${uploadedBy}` : ""
  const emailSubject = `Nyt bryllupsbillede${uploaderInfo} uploadet`

  try {
    await sendEmail({
      to,
      subject: emailSubject,
      text: `Et nyt billede${uploaderInfo} er blevet uploadet til bryllupsgalleriet.`,
      html: `
        <h1>Nyt bryllupsbillede uploadet</h1>
        ${
          uploadedBy
            ? `<p><strong>${uploadedBy}</strong> har uploadet et nyt billede til bryllupsgalleriet.</p>`
            : `<p>Et nyt billede er blevet uploadet til bryllupsgalleriet.</p>`
        }
        <div style="margin: 20px 0;">
          <img src="${photoUrl}" alt="Bryllupsbillede" style="max-width: 600px; max-height: 400px;" />
        </div>
        <p><a href="${photoUrl}" target="_blank">Åbn billede i fuld størrelse</a></p>
      `,
      // Henviser til billedet via URL i stedet for at vedhæfte det
      attachments: [
        {
          filename: photoUrl.split("/").pop() || "bryllupsbillede.jpg",
          href: photoUrl,
        },
      ],
    })
  } catch (error) {
    // Vi videregiver fejlen, men logger den også
    console.error("Fejl ved afsendelse af billede-notifikation:", error)
    throw error
  }
}

export async function sendMultiplePhotosNotification(
  photoUrls: string[],
  uploadedBy?: string
): Promise<void> {
  // Hvis transporter ikke er konfigureret, hop over e-mail
  if (!transporter) {
    console.warn(
      "E-mail notifikation blev sprunget over, fordi transporter ikke er konfigureret"
    )
    return
  }

  if (!photoUrls.length) {
    console.warn("Ingen billeder at sende.")
    return
  }

  const to = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || ""
  if (!to) {
    console.warn("Ingen modtager-e-mail angivet. E-mail blev ikke sendt.")
    return
  }

  console.log(
    `Sender e-mail notifikation med ${photoUrls.length} billeder til: ${to}`
  )

  // Forbered vedhæftede filer og HTML for hvert billede
  const attachments = []
  let imagesHtml = ""

  for (let i = 0; i < photoUrls.length; i++) {
    const photoUrl = photoUrls[i]

    // Tilføj til vedhæftninger
    attachments.push({
      filename: photoUrl.split("/").pop() || `bryllupsbillede-${i + 1}.jpg`,
      href: photoUrl,
    })

    // Tilføj til HTML
    imagesHtml += `
      <div style="margin: 20px 0;">
        <p style="margin-bottom: 5px;"><strong>Billede ${i + 1}</strong></p>
        <img src="${photoUrl}" alt="Bryllupsbillede ${
      i + 1
    }" style="max-width: 600px; max-height: 400px;" />
        <p><a href="${photoUrl}" target="_blank">Åbn billede i fuld størrelse</a></p>
      </div>
    `
  }

  const uploaderInfo = uploadedBy ? ` fra ${uploadedBy}` : ""
  const billederText =
    photoUrls.length === 1
      ? "Nyt bryllupsbillede"
      : `${photoUrls.length} nye bryllupsbilleder`
  const emailSubject = `${billederText}${uploaderInfo} uploadet`
  const hostname = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    await sendEmail({
      to,
      subject: emailSubject,
      text: `${billederText}${uploaderInfo} er blevet uploadet til bryllupsgalleriet.\n\nBesøg galleriet for at se billederne: ${hostname}/gallery`,
      html: `
        <h1>${billederText} uploadet</h1>
        ${
          uploadedBy
            ? `<p><strong>${uploadedBy}</strong> har uploadet ${
                photoUrls.length
              } ${
                photoUrls.length === 1 ? "billede" : "billeder"
              } til bryllupsgalleriet.</p>`
            : `<p>${billederText} er blevet uploadet til bryllupsgalleriet.</p>`
        }
        ${imagesHtml}
        <p style="margin-top: 20px;"><a href="${hostname}/gallery" style="display: inline-block; background-color: #f43f5e; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Besøg galleriet</a></p>
      `,
      // Vedhæft billederne med URL referencer
      attachments,
    })
  } catch (error) {
    // Vi videregiver fejlen, men logger den også
    console.error("Fejl ved afsendelse af billede-notifikation:", error)
    throw error
  }
}
