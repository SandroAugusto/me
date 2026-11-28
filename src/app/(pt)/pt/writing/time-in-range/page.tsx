import type { Metadata } from "next";
import { TimeInRangePt } from "@/articles/time-in-range/pt";
import { ArticleShell } from "@/components/ArticleShell";
import { articleMetadata } from "@/lib/article-metadata";

export const metadata: Metadata = articleMetadata("time-in-range", "pt");

export default function TimeInRangeArticlePt() {
  return (
    <ArticleShell slug="time-in-range" locale="pt">
      <TimeInRangePt />
    </ArticleShell>
  );
}
