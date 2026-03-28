import "./globals.css";

export const metadata = {
  title: "TalentProof — Prouve ce que tu sais faire",
  description:
    "La plateforme panafricaine qui permet aux travailleurs qualifiés de prouver leurs compétences par la vidéo.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#1B4332",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
