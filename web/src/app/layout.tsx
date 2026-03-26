import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono-base",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Synapse",
    template: "%s | Synapse",
  },
  description:
    "Synapse is an AI churn retention platform for SaaS teams that need premium forecasting, campaign automation, and workspace intelligence.",
};

const themeInitScript = `
(() => {
  const key = "synapse-theme";
  const root = document.documentElement;
  const stored = window.localStorage.getItem(key);
  const systemDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored === "dark" || stored === "light"
    ? stored
    : systemDark
      ? "dark"
      : "light";

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
