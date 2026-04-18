/**
 * Design tokens and shared constants for the Datacenter Builder screen.
 * Keeps visual styling consistent across the rack, laptop, toolbar and modals,
 * and adjusts gracefully between desktop and compact layouts.
 */

export const DC_COLORS = {
  // Background layers
  bgPage: "#0A0C10",
  bgPanel: "#10131A",
  bgPanelRaised: "#161A22",
  bgPanelInset: "#0B0E13",
  bgSurface: "#1A1F29",
  bgSurfaceHover: "#222834",

  // Borders
  borderSubtle: "rgba(255,255,255,0.06)",
  borderMuted: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.16)",

  // Text
  textPrimary: "#F4F6FA",
  textSecondary: "#C2C7D0",
  textMuted: "#8B94A3",
  textFaint: "#5A6272",

  // Accents
  accent: "#3B82F6",
  accentSoft: "#60A5FA",
  accentDeep: "#1D4ED8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  console: "#0070F3",

  // Rack/laptop materials
  rackMetal: "#1A1D22",
  rackMetalDark: "#0C0E12",
  rackRail: "#202329",
  rackRailHighlight: "#2A2E36",
  rackScrew: "#3A3F48",
  deviceFace: "#BFC7D2",
  deviceFaceDark: "#8C95A3",
  deviceTop: "#E5EAF0",
  portBody: "#0A0B0E",
  portPin: "#2A2E36",
  laptopBody: "#1E2027",
  laptopBezel: "#0A0B0E",
  laptopBase: "#2A2D34",
  laptopHinge: "#151720",
  terminalBg: "#05070A",
  terminalText: "#4ADE80",
} as const;

export const DC_RADII = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const DC_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 28,
  "3xl": 40,
} as const;

/**
 * Difficulty visual tokens — used for level cards and tier badges.
 */
export const DC_DIFFICULTY: Record<
  "easy" | "medium" | "hard" | "expert" | "extreme",
  { label: string; color: string; soft: string; glyph: string }
> = {
  easy: {
    label: "Básico",
    color: "#22C55E",
    soft: "rgba(34,197,94,0.14)",
    glyph: "●",
  },
  medium: {
    label: "Intermediário",
    color: "#3B82F6",
    soft: "rgba(59,130,246,0.14)",
    glyph: "●●",
  },
  hard: {
    label: "Avançado",
    color: "#F59E0B",
    soft: "rgba(245,158,11,0.14)",
    glyph: "●●●",
  },
  expert: {
    label: "Especialista",
    color: "#EF4444",
    soft: "rgba(239,68,68,0.14)",
    glyph: "●●●●",
  },
  extreme: {
    label: "Extremo",
    color: "#A855F7",
    soft: "rgba(168,85,247,0.14)",
    glyph: "●●●●●",
  },
};

/**
 * Cable visual definitions — used consistently everywhere a cable is drawn
 * or listed. Falling back to a neutral blue for unknown ids.
 */
export const DC_CABLE_VISUALS: Record<
  string,
  { color: string; label: string; description: string }
> = {
  ethernet: {
    color: "#3B82F6",
    label: "Ethernet",
    description: "Cobre RJ45 — uso geral",
  },
  fiber: {
    color: "#EF4444",
    label: "Fibra Óptica",
    description: "Longa distância / alta velocidade",
  },
  fiber_copper: {
    color: "#EC4899",
    label: "Fibra/Cobre",
    description: "Híbrido ou conversor",
  },
  coaxial: {
    color: "#A1A1AA",
    label: "Coaxial",
    description: "Operadora / sinal de entrada",
  },
  direct_attach: {
    color: "#A855F7",
    label: "DAC (Direct Attach)",
    description: "Curta distância — alta taxa",
  },
  console: {
    color: "#0070F3",
    label: "Console / Serial",
    description: "Gerenciamento CLI via notebook",
  },
};

/**
 * Rack geometry tokens. All values are in SVG units; the rack is scaled to fit
 * the viewport via a single `scale()` transform so visual proportions stay
 * stable between breakpoints.
 */
export const RACK_GEOMETRY = {
  width: 520,
  railWidth: 32,
  slotHeight: 78,
  paddingTop: 18,
  paddingBottom: 18,
} as const;

/**
 * Laptop geometry tokens.
 */
export const LAPTOP_GEOMETRY = {
  width: 560,
  height: 360,
  bezel: 26,
  screenRadius: 14,
  baseExtra: 60,
} as const;

/**
 * Breakpoints specific to this screen's canvas. The screen already uses the
 * global `useLayoutMode()` hook for the chrome, but the SVG workbench needs a
 * finer breakpoint to decide when to stack the rack above the laptop.
 */
export const DC_BREAKPOINTS = {
  stackCanvas: 980, // below this → rack above laptop
  compactChrome: 720, // below this → tighter paddings / icon-only buttons
} as const;
