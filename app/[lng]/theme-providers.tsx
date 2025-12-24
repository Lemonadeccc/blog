"use client";

import { ThemeProvider } from "next-themes";
import { CookiesProvider } from "react-cookie";

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </CookiesProvider>
  );
}