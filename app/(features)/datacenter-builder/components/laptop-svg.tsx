import React from "react";
import {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from "react-native-svg";

import { DC_COLORS, LAPTOP_GEOMETRY } from "../datacenter-builder.constants";

type LaptopSvgProps = {
  /** Whether the console session is active (drives screen mode and port LED). */
  connected: boolean;
  /** Whether the user is currently picking a serial endpoint. */
  serialSelected?: boolean;
  /** Position the serial port on the right edge (mobile) instead of the left (desktop). */
  serialOnRight?: boolean;
};

/**
 * Exported geometry so the parent component can align transparent Pressables
 * over the serial port and over the active terminal area.
 */
export const LAPTOP_PORT = {
  width: 28,
  height: 20,
  insetY: 14, // distance from laptop bottom edge
};

export function getLaptopSerialPortLocalPos(serialOnRight: boolean) {
  // Returns the top-left of the serial port rectangle in the laptop's local SVG space.
  const y = LAPTOP_GEOMETRY.height + LAPTOP_PORT.insetY;
  const x = serialOnRight
    ? LAPTOP_GEOMETRY.width + 14
    : -LAPTOP_PORT.width - 14;
  return { x, y };
}

export function getLaptopScreenRect() {
  const bezel = LAPTOP_GEOMETRY.bezel;
  return {
    x: bezel,
    y: bezel,
    width: LAPTOP_GEOMETRY.width - bezel * 2,
    height: LAPTOP_GEOMETRY.height - bezel * 2 - 30, // bottom chin
  };
}

export function LaptopSvg({
  connected,
  serialSelected = false,
  serialOnRight = false,
}: LaptopSvgProps) {
  const W = LAPTOP_GEOMETRY.width;
  const H = LAPTOP_GEOMETRY.height;
  const bezel = LAPTOP_GEOMETRY.bezel;
  const base = LAPTOP_GEOMETRY.baseExtra;
  const screen = getLaptopScreenRect();
  const serialPos = getLaptopSerialPortLocalPos(serialOnRight);

  return (
    <G>
      <Defs>
        <LinearGradient id="laptop-lid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#262A33" />
          <Stop offset="1" stopColor={DC_COLORS.laptopBody} />
        </LinearGradient>
        <LinearGradient id="laptop-base" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={DC_COLORS.laptopBase} />
          <Stop offset="1" stopColor="#1A1C22" />
        </LinearGradient>
        <LinearGradient id="laptop-screen-off" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0A0D12" />
          <Stop offset="1" stopColor="#050709" />
        </LinearGradient>
        <LinearGradient id="laptop-screen-on" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#061018" />
          <Stop offset="1" stopColor="#020508" />
        </LinearGradient>
        <LinearGradient id="laptop-screen-glare" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="rgba(255,255,255,0.08)" />
          <Stop offset="0.6" stopColor="rgba(255,255,255,0)" />
        </LinearGradient>
      </Defs>

      {/* Base / keyboard deck */}
      <Path
        d={`
          M -22 ${H}
          L ${W + 22} ${H}
          Q ${W + 46} ${H} ${W + 46} ${H + 14}
          L ${W + 46} ${H + base - 16}
          Q ${W + 46} ${H + base} ${W + 22} ${H + base}
          L -22 ${H + base}
          Q -46 ${H + base} -46 ${H + base - 16}
          L -46 ${H + 14}
          Q -46 ${H} -22 ${H}
          Z
        `}
        fill="url(#laptop-base)"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1}
      />

      {/* Trackpad */}
      <Rect
        x={W / 2 - 80}
        y={H + base - 28}
        width={160}
        height={18}
        rx={4}
        fill="#14161B"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={1}
      />

      {/* Keyboard hint — faint grid of keys */}
      <G opacity={0.45}>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 14 }).map((__, col) => (
            <Rect
              key={`key-${row}-${col}`}
              x={W / 2 - 210 + col * 30}
              y={H + 12 + row * 10}
              width={22}
              height={6}
              rx={1.5}
              fill="#1C1F26"
            />
          )),
        )}
      </G>

      {/* Hinge strip */}
      <Rect
        x={-6}
        y={H - 4}
        width={W + 12}
        height={8}
        rx={2}
        fill={DC_COLORS.laptopHinge}
      />

      {/* Lid / body */}
      <Rect
        x={0}
        y={0}
        width={W}
        height={H}
        rx={22}
        fill="url(#laptop-lid)"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={1}
      />

      {/* Outer bezel shadow */}
      <Rect
        x={bezel - 4}
        y={bezel - 4}
        width={W - (bezel - 4) * 2}
        height={H - 30 - (bezel - 4) * 2 + 4}
        rx={LAPTOP_GEOMETRY.screenRadius + 2}
        fill={DC_COLORS.laptopBezel}
      />

      {/* Screen */}
      <Rect
        x={screen.x}
        y={screen.y}
        width={screen.width}
        height={screen.height}
        rx={LAPTOP_GEOMETRY.screenRadius}
        fill={`url(#${connected ? "laptop-screen-on" : "laptop-screen-off"})`}
      />

      {/* Screen glare */}
      <Path
        d={`
          M ${screen.x} ${screen.y}
          L ${screen.x + screen.width * 0.55} ${screen.y}
          L ${screen.x + screen.width * 0.35} ${screen.y + screen.height}
          L ${screen.x} ${screen.y + screen.height}
          Z
        `}
        fill="url(#laptop-screen-glare)"
        opacity={0.9}
      />

      {/* Webcam */}
      <Circle cx={W / 2} cy={bezel / 2} r={2.5} fill="#0A0B0E" stroke="rgba(255,255,255,0.1)" strokeWidth={0.6} />
      <Circle cx={W / 2} cy={bezel / 2} r={1} fill="#1B1E24" />

      {/* Bottom chin with brand dot */}
      <Circle cx={W / 2} cy={H - 16} r={2.5} fill="rgba(255,255,255,0.14)" />

      {/* Power LED on base */}
      <Circle
        cx={W - 24}
        cy={H + base - 8}
        r={2.2}
        fill={connected ? "#22C55E" : "#3A3F48"}
      />

      {/* Serial / console port on side */}
      <G>
        <Rect
          x={serialPos.x - 2}
          y={serialPos.y - 2}
          width={LAPTOP_PORT.width + 4}
          height={LAPTOP_PORT.height + 4}
          rx={3}
          fill="rgba(0,0,0,0.35)"
        />
        <Rect
          x={serialPos.x}
          y={serialPos.y}
          width={LAPTOP_PORT.width}
          height={LAPTOP_PORT.height}
          rx={2.5}
          fill="#0A0D12"
          stroke={serialSelected ? DC_COLORS.accent : DC_COLORS.console}
          strokeWidth={serialSelected ? 2 : 1.2}
        />
        <Rect
          x={serialPos.x + 5}
          y={serialPos.y + 5}
          width={LAPTOP_PORT.width - 10}
          height={LAPTOP_PORT.height - 10}
          rx={1}
          fill={connected ? DC_COLORS.console : "#15181E"}
        />
        <SvgText
          x={serialPos.x + LAPTOP_PORT.width / 2}
          y={serialPos.y + LAPTOP_PORT.height + 10}
          fill={DC_COLORS.console}
          fontSize={7}
          fontWeight="900"
          textAnchor="middle"
        >
          SERIAL
        </SvgText>
      </G>
    </G>
  );
}
