"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme provider (class strategy → toggles `.dark` on <html>). The storefront
 * ships light-first; the token system already carries a `.dark` skeleton so a
 * theme toggle can be enabled later without touching components.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
