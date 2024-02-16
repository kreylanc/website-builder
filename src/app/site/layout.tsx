import { Inter } from "next/font/google";
import "../globals.css";
import Navigation from "@/components/ui/site/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <Navigation />
      {children}
    </ClerkProvider>
  );
}
