export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Renas & Ayse's Bryllup",
  description: "Del dine billeder fra vores specielle dag",
  mainNav: [
    {
      title: "Hjem",
      href: "/",
    },
    {
      title: "Galleri",
      href: "/gallery",
    },
    {
      title: "Upload",
      href: "/upload",
    },
  ],
  links: {
    gallery: "/gallery",
    upload: "/upload",
  },
}
