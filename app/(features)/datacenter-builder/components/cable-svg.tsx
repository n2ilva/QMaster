import React from "react";
import { Circle, G, Path } from "react-native-svg";

import { DC_COLORS } from "../datacenter-builder.constants";

type CablePathProps = {
  /** Starting point in the outer SVG coordinate space (already scaled). */
  from: { x: number; y: number };
  /** Ending point in the outer SVG coordinate space (already scaled). */
  to: { x: number; y: number };
  /** Cable color (use `getCableColor` from helpers to resolve). */
  color: string;
  /** Visual state of this connection. */
  state?: "active" | "pending" | "error";
  /** Dashed style for console (serial) cables. */
  dashed?: boolean;
  /** Stroke width in the outer SVG coordinate space. */
  strokeWidth?: number;
};

/**
 * Renders a datacenter cable as a smooth cubic Bézier curve with a subtle
 * drop shadow and glossy highlight, so cables feel like physical strands
 * and not CSS lines.
 *
 * The control points push horizontally first so connections leaving the
 * rack on the right look like neatly routed patch cables.
 */
export function CablePath({
  from,
  to,
  color,
  state = "active",
  dashed = false,
  strokeWidth = 3.2,
}: CablePathProps) {
  const dx = Math.max(60, Math.abs(to.x - from.x) * 0.5);
  const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y} ${to.x - dx} ${to.y} ${to.x} ${to.y}`;

  const isError = state === "error";
  const isPending = state === "pending";
  const baseColor = isError ? DC_COLORS.danger : color;
  const opacity = isPending ? 0.45 : 0.95;

  return (
    <G>
      {/* Drop shadow — gives the cable depth without a filter */}
      <Path
        d={path}
        stroke="rgba(0,0,0,0.45)"
        strokeWidth={strokeWidth + 2}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />

      {/* Main strand */}
      <Path
        d={path}
        stroke={baseColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
        strokeDasharray={dashed ? `${strokeWidth * 3},${strokeWidth * 1.6}` : undefined}
      />

      {/* Inner highlight — thinner, lighter stroke on top for a glossy feel */}
      <Path
        d={path}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth={Math.max(0.6, strokeWidth * 0.35)}
        strokeLinecap="round"
        fill="none"
        opacity={isPending ? 0.3 : 0.7}
        strokeDasharray={dashed ? `${strokeWidth * 3},${strokeWidth * 1.6}` : undefined}
      />

      {/* End caps (connector heads) */}
      <Circle cx={from.x} cy={from.y} r={strokeWidth * 0.9 + 1} fill="rgba(0,0,0,0.55)" />
      <Circle cx={from.x} cy={from.y} r={strokeWidth * 0.9} fill={baseColor} opacity={opacity} />
      <Circle cx={to.x} cy={to.y} r={strokeWidth * 0.9 + 1} fill="rgba(0,0,0,0.55)" />
      <Circle cx={to.x} cy={to.y} r={strokeWidth * 0.9} fill={baseColor} opacity={opacity} />
    </G>
  );
}

type PendingCableProps = {
  from: { x: number; y: number };
  strokeWidth?: number;
};

/**
 * A ghost indicator drawn on the source port while the user is picking the
 * destination for a new connection. Intentionally simple — no cursor tracking
 * because we don't have pointer position in all platforms.
 */
export function PendingSourceMarker({ from, strokeWidth = 3.2 }: PendingCableProps) {
  return (
    <G>
      <Circle
        cx={from.x}
        cy={from.y}
        r={strokeWidth * 2.2}
        fill="none"
        stroke={DC_COLORS.accent}
        strokeWidth={1.4}
        strokeDasharray="3,3"
        opacity={0.85}
      />
      <Circle cx={from.x} cy={from.y} r={strokeWidth * 0.9} fill={DC_COLORS.accent} />
    </G>
  );
}
