import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const font = Host_Grotesk({
  subsets: ["latin"],
  display: "swap", // SEO + performance win
});

export const metadata: Metadata = {
  metadataBase: new URL("https://n8n-clone-drab.vercel.app"), // IMPORTANT
  title: {
    default: "Mini Automation Engine",
    template: "%s · Mini Automation Engine",
  },
  description:
    "A linear workflow automation engine inspired by n8n. Build trigger → executor workflows with predictable, step-by-step execution.",
  applicationName: "Mini Automation Engine",
  keywords: [
    "workflow automation",
    "n8n alternative",
    "automation engine",
    "next.js automation",
    "inngest",
    "topological sort workflows",
  ],
  authors: [{ name: "Musheer" }],
  creator: "Musheer",

  openGraph: {
    title: "Mini Automation Engine",
    description:
      "A simple, linear workflow automation engine inspired by n8n. No loops, no chaos — just predictable execution.",
    url: "https://n8n-clone-drab.vercel.app",
    siteName: "Mini Automation Engine",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Mini Automation Engine Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mini Automation Engine",
    description:
      "A linear workflow automation engine inspired by n8n. Build predictable automations without complexity.",
    images: ["/hero.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased min-h-screen w-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
