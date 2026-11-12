import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootShell } from "@/components/RootShell";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = buildMetadata("en");

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
