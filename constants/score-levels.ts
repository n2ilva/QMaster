import type { ScoreLevel } from "@/lib/api";

export const SCORE_LEVEL_EMOJIS: Record<ScoreLevel, string> = {
  Bronze: "🥉",
  Prata: "🥈",
  Ouro: "🥇",
  Diamante: "💎",
};

export const SCORE_LEVEL_COLORS: Record<ScoreLevel, string> = {
  Bronze: "#CD7F32",
  Prata: "#C0C0C0",
  Ouro: "#FFD700",
  Diamante: "#00CED1",
};

export const SCORE_LEVELS: ScoreLevel[] = [
  "Bronze",
  "Prata",
  "Ouro",
  "Diamante",
];

export const SCORE_LEVEL_RANGES: Record<ScoreLevel, string> = {
  Bronze: "0 — 500 pts",
  Prata: "501 — 1.500 pts",
  Ouro: "1.501 — 3.000 pts",
  Diamante: "3.000+ pts",
};
