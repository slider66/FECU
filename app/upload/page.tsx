import { Metadata } from "next"

import { UploadContent } from "@/components/upload-content"

export const metadata: Metadata = {
  title: "Upload Billeder | Renas & Ayse's Bryllup",
  description: "Del dine yndlingsøjeblikke fra vores bryllup",
  openGraph: {
    title: "Upload Billeder | Renas & Ayse's Bryllup",
    description: "Del dine yndlingsøjeblikke fra vores bryllup",
    type: "website",
  },
}

export default function UploadPage() {
  return <UploadContent />
}
