import { GlobalStyle } from "@/styles/global";
import type { Metadata } from "next";

const siteName = "Origem Mineral";
const siteDescription =
  "Sistema de rastreabilidade mineral e registro de origem para mineradoras, cooperativas e distribuidores. Gerencie documentos, origem do minério e conformidade legal em um só lugar.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <GlobalStyle />
        {children}
      </body>
    </html>
  );
}
