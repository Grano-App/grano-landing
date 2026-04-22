import { Comfortaa, Unbounded } from "next/font/google";

export const comfortaa = Comfortaa({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

export const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-display",
});
