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
    path: string
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

export async function sendPhotoNotification(photoPath: string): Promise<void> {
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

  // Konverter relativ sti til absolut URL
  const hostname = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const absoluteImageUrl = `${hostname}${photoPath}`

  // Tjek om filen eksisterer
  const localImagePath = path.join(process.cwd(), "public", photoPath)
  if (!existsSync(localImagePath)) {
    console.warn(
      `Advarsel: Billedfilen findes ikke på stien: ${localImagePath}`
    )
  }

  try {
    await sendEmail({
      to,
      subject: "Nyt bryllupsbillede uploadet",
      text: `Et nyt billede er blevet uploadet til bryllupsgalleriet.\n\nSe billedet her: ${absoluteImageUrl}`,
      html: `
        <h1>Nyt bryllupsbillede uploadet</h1>
        <p>Et nyt billede er blevet uploadet til bryllupsgalleriet.</p>
        <div style="margin: 20px 0;">
          <img src="${absoluteImageUrl}" alt="Bryllupsbillede" style="max-width: 600px; max-height: 400px;" />
        </div>
        <p><a href="${absoluteImageUrl}" target="_blank">Åbn billede i fuld størrelse</a></p>
      `,
      // Vedhæft billedet (fra lokal filsti)
      attachments: [
        {
          filename: photoPath.split("/").pop() || "bryllupsbillede.jpg",
          path: localImagePath,
        },
      ],
    })
  } catch (error) {
    // Vi videregiver fejlen, men logger den også
    console.error("Fejl ved afsendelse af billede-notifikation:", error)
    throw error
  }
}
