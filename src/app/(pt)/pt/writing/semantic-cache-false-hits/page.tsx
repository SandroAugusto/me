import type { Metadata } from "next";
import { SemanticCachePt } from "@/articles/semantic-cache-false-hits/pt";
import { ArticleShell } from "@/components/ArticleShell";
import { articleMetadata } from "@/lib/article-metadata";

export const metadata: Metadata = articleMetadata("semantic-cache-false-hits", "pt");

export default function SemanticCacheArticle() {
  return (
    <ArticleShell slug="semantic-cache-false-hits" locale="pt">
      <SemanticCachePt />
    </ArticleShell>
  );
}
