import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/providers/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "readmepolished - Craft Perfect READMEs",
  description: "Interactive README generator with step-by-step wizard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
