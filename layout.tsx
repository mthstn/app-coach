import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APP Planner",
  description: "Planification running + renfo, charge & monotonie, emails hebdo",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
