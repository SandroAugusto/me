import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootShell } from "@/components/RootShell";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = buildMetadata("pt");

export default function PortugueseLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="pt">{children}</RootShell>;
}
