import type { Metadata } from "next";
import { TimeInRangeEn } from "@/articles/time-in-range/en";
import { ArticleShell } from "@/components/ArticleShell";
import { articleMetadata } from "@/lib/article-metadata";

export const metadata: Metadata = articleMetadata("time-in-range", "en");

export default function TimeInRangeArticle() {
  return (
    <ArticleShell slug="time-in-range" locale="en">
      <TimeInRangeEn />
    </ArticleShell>
  );
}
