import type { Locale } from "@/lib/site";
import { en } from "./en";
import { pt } from "./pt";
import type { Content } from "./types";

export const content: Record<Locale, Content> = { en, pt };
export type { Content } from "./types";
