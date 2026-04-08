// app/layout.js
import "./globals.css";

export const metadata = {
  title: "TalentProof Afrique — Les talents prouvés en vidéo",
  description:
    "Chauffeur, aide ménagère, couturière, électricien, gardien… " +
    "Diplômé ou pas, tout le monde a sa place sur TalentProof.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TalentProof",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B1628",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* PWA — Apple specific */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TalentProof" />
        {/* Sécurité */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body>{children}</body>
    </html>
  );
}