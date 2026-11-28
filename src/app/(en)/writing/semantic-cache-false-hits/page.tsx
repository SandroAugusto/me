import type { Metadata } from "next";
import { SemanticCacheEn } from "@/articles/semantic-cache-false-hits/en";
import { ArticleShell } from "@/components/ArticleShell";
import { articleMetadata } from "@/lib/article-metadata";

export const metadata: Metadata = articleMetadata("semantic-cache-false-hits", "en");

export default function SemanticCacheArticle() {
  return (
    <ArticleShell slug="semantic-cache-false-hits" locale="en">
      <SemanticCacheEn />
    </ArticleShell>
  );
}
