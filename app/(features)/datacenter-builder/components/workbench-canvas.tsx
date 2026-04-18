import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { G } from "react-native-svg";

import {
    DC_BREAKPOINTS,
    DC_COLORS,
    DC_RADII,
    LAPTOP_GEOMETRY,
    RACK_GEOMETRY,
} from "../datacenter-builder.constants";
import { getCableColor } from "../datacenter-builder.helpers";
import type {
    ActiveConnection,
    Cable,
    InventoryDevice,
    PortStatusMap,
} from "../datacenter-builder.types";
import { CablePath, PendingSourceMarker } from "./cable-svg";
import { DeviceManual } from "./device-manual";
import { DeviceTerminal } from "./device-terminal";
import {
    LAPTOP_PORT,
    LaptopSvg,
    getLaptopScreenRect,
    getLaptopSerialPortLocalPos,
} from "./laptop-svg";
import {
    RACK_PORT,
    RackSvg,
    getPortX,
    getRackHeight,
    getSlotY,
} from "./rack-svg";

type WorkbenchCanvasProps = {
  inventory: InventoryDevice[];
  installedDevices: Record<number, InventoryDevice>;
  connections: ActiveConnection[];
  cableTypes: Cable[];
  ledOn: boolean;
  /** Per-port status map keyed by `${deviceId}.${portId}`. */
  portStatus: PortStatusMap;
  sourceNode: { deviceId: string; port: string } | null;
  consoleDevice: InventoryDevice | null;
  onSlotPress: (slotIndex: number) => void;
  onUninstall: (slotIndex: number) => void;
  onPortPress: (deviceId: string, port: string) => void;
  onLaptopSerialPress: () => void;
  onConsoleClose: () => void;
  /** Fired when the user completes a full CLI section on the active device. */
  onConsoleSectionCompleted?: (token: string, section: string) => void;
  /**
   * Fired when the terminal's TextInput gains/loses focus. The canvas
   * passes along the absolute Y position of the laptop within the canvas
   * so the parent screen can scroll it above the soft keyboard on mobile
   * and web mobile.
   */
  onConsoleInputFocusChange?: (focused: boolean, laptopAbsoluteY: number) => void;
  /** Tokens of CLI sections the user has already completed on the current device. */
  consoleManualCompletedTokens?: ReadonlySet<string>;
  /** Whether the device manual panel is collapsed. */
  consoleManualCollapsed?: boolean;
  /** Toggles the manual panel open/closed. */
  onConsoleManualToggle?: () => void;
};

/**
 * Renders the full workbench (rack + laptop + cables). Pure visual / input
 * glue — all state lives in the parent. The canvas positions a single
 * `Svg` layer and overlays transparent `Pressable`s at the exact positions
 * of ports and slots so clicks map 1:1 to SVG geometry.
 */
export function WorkbenchCanvas({
  inventory,
  installedDevices,
  connections,
  cableTypes,
  ledOn,
  portStatus,
  sourceNode,
  consoleDevice,
  onSlotPress,
  onUninstall,
  onPortPress,
  onLaptopSerialPress,
  onConsoleClose,
  onConsoleSectionCompleted,
  onConsoleInputFocusChange,
  consoleManualCompletedTokens,
  consoleManualCollapsed,
  onConsoleManualToggle,
}: WorkbenchCanvasProps) {
  // We measure the *container* width (not the window) so the canvas adapts
  // correctly when a sidebar or padding shrinks the available space.
  const [containerWidth, setContainerWidth] = useState(0);
  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - containerWidth) > 0.5) {
      setContainerWidth(w);
    }
  };
  // Until we have measured the container, fall back to a reasonable default
  // so the first render doesn't collapse to zero.
  const effectiveWidth = containerWidth > 0 ? containerWidth : 960;
  const stacked = effectiveWidth < DC_BREAKPOINTS.stackCanvas;

  // Height reserved above the laptop for the device manual panel. It floats
  // just on top of the notebook so the user can see the required CLI
  // sections while typing. When there is no active console session the
  // reservation collapses to zero.
  //
  // The open height is responsive: on narrow screens we keep a smaller fixed
  // panel and rely on the manual's internal ScrollView so it never overlaps
  // the notebook.
  const MANUAL_GAP = 10;
  // Collapsed shows the full header (icon + title + 2-line subtitle + pill)
  // without truncating the description.
  const MANUAL_COLLAPSED_H = 80;
  const MANUAL_OPEN_H =
    effectiveWidth < 480 ? 180 : effectiveWidth < 720 ? 220 : 260;
  const manualHeight = consoleDevice
    ? consoleManualCollapsed
      ? MANUAL_COLLAPSED_H
      : MANUAL_OPEN_H
    : 0;
  const manualReserved = consoleDevice ? manualHeight + MANUAL_GAP : 0;

  // Layout math --------------------------------------------------------------
  const layout = useMemo(() => {
    const slots = inventory.length || 1;
    const rackW = RACK_GEOMETRY.width;
    const rackH = getRackHeight(slots);
    const lapW = LAPTOP_GEOMETRY.width;
    const lapH = LAPTOP_GEOMETRY.height + LAPTOP_GEOMETRY.baseExtra;

    // The canvas tries to fit the wider of the two shapes at each column.
    // On stacked mode we size by the *wider* shape, otherwise side by side.
    const horizontalPadding = 32;
    const availableWidth = Math.max(320, effectiveWidth - horizontalPadding);

    if (stacked) {
      const widest = Math.max(rackW, lapW);
      const scale = Math.min(1, availableWidth / widest);
      const rackOffsetX = (availableWidth - rackW * scale) / 2;
      const laptopOffsetX = (availableWidth - lapW * scale) / 2;
      const rackOffsetY = 0;
      const gap = 40;
      // Push the laptop down to leave room for the floating manual panel.
      const laptopOffsetY = rackH * scale + gap + manualReserved;
      const totalW = availableWidth;
      const totalH = laptopOffsetY + lapH * scale + 20;
      return {
        stacked: true,
        scale,
        rackOffsetX,
        rackOffsetY,
        laptopOffsetX,
        laptopOffsetY,
        totalW,
        totalH,
      };
    }

    const gap = 80;
    const needed = rackW + gap + lapW;
    const scale = Math.min(1, availableWidth / needed);
    const rackOffsetX = 20;
    const laptopOffsetX = rackOffsetX + rackW * scale + gap * scale;
    const rackOffsetY = 20;
    // In desktop mode the laptop sits next to the rack; push it down to leave
    // room for the manual panel hovering above it.
    const laptopOffsetY = 20 + manualReserved;
    const totalW = laptopOffsetX + lapW * scale + 20;
    const totalH = Math.max(rackH + 40, laptopOffsetY + lapH * scale + 20);
    return {
      stacked: false,
      scale,
      rackOffsetX,
      rackOffsetY,
      laptopOffsetX,
      laptopOffsetY,
      totalW,
      totalH,
    };
  }, [effectiveWidth, stacked, inventory.length, manualReserved]);

  const boardWidth = RACK_GEOMETRY.width - RACK_GEOMETRY.railWidth * 2;

  // Absolute port position in outer SVG space (already scaled). -------------
  const getAbsolutePortPos = (deviceId: string, portId: string) => {
    const slotIndex = Object.keys(installedDevices).find(
      (k) => installedDevices[parseInt(k, 10)].id === deviceId,
    );
    if (slotIndex === undefined) return null;
    const idx = parseInt(slotIndex, 10);
    const dev = installedDevices[idx];
    const portIndex = dev.ports.findIndex((p) => p.id === portId);
    if (portIndex < 0) return null;
    const port = dev.ports[portIndex];

    const localX =
      RACK_GEOMETRY.railWidth +
      getPortX(port, portIndex, boardWidth) +
      RACK_PORT.width / 2;
    const localY = getSlotY(idx) + RACK_PORT.topOffset + RACK_PORT.height / 2;

    return {
      x: layout.rackOffsetX + localX * layout.scale,
      y: layout.rackOffsetY + localY * layout.scale,
    };
  };

  const laptopSerialAbsPos = (() => {
    const local = getLaptopSerialPortLocalPos(layout.stacked);
    return {
      x:
        layout.laptopOffsetX +
        (local.x + LAPTOP_PORT.width / 2) * layout.scale,
      y:
        layout.laptopOffsetY +
        (local.y + LAPTOP_PORT.height / 2) * layout.scale,
    };
  })();

  const getAbsolutePortFor = (endpoint: {
    deviceId: string;
    port: string;
  }) => {
    if (endpoint.deviceId === "laptop") return laptopSerialAbsPos;
    return getAbsolutePortPos(endpoint.deviceId, endpoint.port);
  };

  const sourceAbs = sourceNode ? getAbsolutePortFor(sourceNode) : null;

  // Screen rect for the laptop terminal overlay ----------------------------
  const screenRect = (() => {
    const r = getLaptopScreenRect();
    return {
      left: layout.laptopOffsetX + r.x * layout.scale,
      top: layout.laptopOffsetY + r.y * layout.scale,
      width: r.width * layout.scale,
      height: r.height * layout.scale,
    };
  })();

  const content = (
    <View
      style={{ width: layout.totalW, height: layout.totalH }}
      accessibilityRole="none"
    >
      <Svg width={layout.totalW} height={layout.totalH}>
        {/* Rack */}
        <G
          transform={`translate(${layout.rackOffsetX}, ${layout.rackOffsetY}) scale(${layout.scale})`}
        >
          <RackSvg
            inventory={inventory}
            installedDevices={installedDevices}
            ledOn={ledOn}
            portStatus={portStatus}
            selectedPort={sourceNode}
          />
        </G>

        {/* Laptop */}
        <G
          transform={`translate(${layout.laptopOffsetX}, ${layout.laptopOffsetY}) scale(${layout.scale})`}
        >
          <LaptopSvg
            connected={!!consoleDevice}
            serialSelected={sourceNode?.deviceId === "laptop"}
            serialOnRight={layout.stacked}
          />
        </G>

        {/* Cables (in outer coordinate space).
            Console cables (laptop endpoint) are drawn in a separate SVG overlay
            rendered AFTER the terminal screen view, so they pass in front of the
            laptop's terminal display — matching how a real console cable sits
            visually in front of the laptop. */}
        {connections.map((conn) => {
          if (!conn.to) return null;
          const isConsoleCable =
            conn.from.deviceId === "laptop" || conn.to.deviceId === "laptop";
          if (isConsoleCable) return null;
          const from = getAbsolutePortFor(conn.from);
          const to = getAbsolutePortFor(conn.to);
          if (!from || !to) return null;
          const color = getCableColor(conn.cableId, cableTypes);
          return (
            <CablePath
              key={conn.id}
              from={from}
              to={to}
              color={color}
              dashed={conn.cableId === "console"}
              strokeWidth={3.2 * layout.scale + 0.4}
            />
          );
        })}

        {/* Pending source marker (only when source is not the laptop serial —
            laptop-origin pending marker is rendered in the overlay SVG below). */}
        {sourceAbs && sourceNode?.deviceId !== "laptop" && (
          <PendingSourceMarker
            from={sourceAbs}
            strokeWidth={3.2 * layout.scale + 0.4}
          />
        )}
      </Svg>

      {/* Interaction overlays ------------------------------------------- */}
      {/* Slot / port presseables */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: layout.rackOffsetX,
          top: layout.rackOffsetY,
          width: RACK_GEOMETRY.width * layout.scale,
          height: getRackHeight(inventory.length) * layout.scale,
        }}
      >
        {inventory.map((_, i) => {
          const installed = installedDevices[i];
          const slotTop = getSlotY(i) * layout.scale;
          const slotH = RACK_GEOMETRY.slotHeight * layout.scale;
          return (
            <View
              key={`slot-overlay-${i}`}
              pointerEvents="box-none"
              style={{
                position: "absolute",
                left: 0,
                top: slotTop,
                width: RACK_GEOMETRY.width * layout.scale,
                height: slotH,
              }}
            >
              <Pressable
                onPress={() =>
                  installed ? onUninstall(i) : onSlotPress(i)
                }
                style={StyleSheet.absoluteFillObject}
                accessibilityRole="button"
                accessibilityLabel={
                  installed
                    ? `Remover ${installed.label ?? installed.id}`
                    : `Instalar equipamento no slot ${inventory.length - i}U`
                }
              />
              {installed &&
                installed.ports.map((p, pIdx) => {
                  const px =
                    (RACK_GEOMETRY.railWidth +
                      getPortX(p, pIdx, boardWidth)) *
                    layout.scale;
                  const py = RACK_PORT.topOffset * layout.scale;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => onPortPress(installed.id, p.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Porta ${p.id} de ${installed.label ?? installed.id}`}
                      hitSlop={6}
                      style={{
                        position: "absolute",
                        left: px,
                        top: py,
                        width: Math.max(28, RACK_PORT.width * layout.scale),
                        height: Math.max(28, RACK_PORT.height * layout.scale),
                      }}
                    />
                  );
                })}
            </View>
          );
        })}
      </View>

      {/* Laptop serial port overlay */}
      <Pressable
        onPress={onLaptopSerialPress}
        accessibilityRole="button"
        accessibilityLabel="Porta serial do notebook"
        hitSlop={8}
        style={{
          position: "absolute",
          left: laptopSerialAbsPos.x - Math.max(18, LAPTOP_PORT.width * layout.scale) / 2,
          top: laptopSerialAbsPos.y - Math.max(18, LAPTOP_PORT.height * layout.scale) / 2,
          width: Math.max(36, LAPTOP_PORT.width * layout.scale + 12),
          height: Math.max(36, LAPTOP_PORT.height * layout.scale + 12),
        }}
      />

      {/* Device manual — floats just above the notebook so the user can read
          the expected CLI sections while typing. Its width matches the
          laptop body (scaled). */}
      {consoleDevice ? (
        <View
          style={{
            position: "absolute",
            left: layout.laptopOffsetX,
            top: Math.max(4, layout.laptopOffsetY - manualHeight - MANUAL_GAP),
            width: LAPTOP_GEOMETRY.width * layout.scale,
            height: manualHeight,
          }}
        >
          <DeviceManual
            device={consoleDevice}
            completedTokens={consoleManualCompletedTokens ?? new Set()}
            collapsed={!!consoleManualCollapsed}
            onToggleCollapsed={() => onConsoleManualToggle?.()}
          />
        </View>
      ) : null}

      {/* Terminal content over the laptop screen */}
      <View
        pointerEvents={consoleDevice ? "auto" : "none"}
        style={{
          position: "absolute",
          left: screenRect.left,
          top: screenRect.top,
          width: screenRect.width,
          height: screenRect.height,
          padding: 8,
        }}
      >
        {consoleDevice ? (
          <DeviceTerminal
            device={consoleDevice}
            onClose={onConsoleClose}
            onSectionCompleted={onConsoleSectionCompleted}
            onInputFocusChange={(focused) =>
              onConsoleInputFocusChange?.(focused, layout.laptopOffsetY)
            }
          />
        ) : (
          <View style={styles.screenIdle}>
            <MaterialCommunityIcons name="console-network" size={36} color={DC_COLORS.textFaint} />
            <Text style={styles.screenIdleText}>AGUARDANDO CONEXÃO</Text>
            <Text style={styles.screenIdleHint}>
              Conecte o cabo de console do notebook a um equipamento.
            </Text>
          </View>
        )}
      </View>

      {/* Console cable overlay — drawn ABOVE the terminal screen so the cable
          visually passes in front of the laptop display (like a real console
          cable plugged into the side of a notebook). */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: layout.totalW,
          height: layout.totalH,
        }}
      >
        <Svg width={layout.totalW} height={layout.totalH}>
          {connections.map((conn) => {
            if (!conn.to) return null;
            const isConsoleCable =
              conn.from.deviceId === "laptop" || conn.to.deviceId === "laptop";
            if (!isConsoleCable) return null;
            const from = getAbsolutePortFor(conn.from);
            const to = getAbsolutePortFor(conn.to);
            if (!from || !to) return null;
            const color = getCableColor(conn.cableId, cableTypes);
            return (
              <CablePath
                key={conn.id}
                from={from}
                to={to}
                color={color}
                dashed={conn.cableId === "console"}
                strokeWidth={3.2 * layout.scale + 0.4}
              />
            );
          })}
          {sourceAbs && sourceNode?.deviceId === "laptop" && (
            <PendingSourceMarker
              from={sourceAbs}
              strokeWidth={3.2 * layout.scale + 0.4}
            />
          )}
        </Svg>
      </View>
    </View>
  );

  // Horizontal scroll only when we actually overflow -----------------------
  return (
    <View onLayout={handleLayout} style={{ width: "100%", overflow: "hidden" }}>
      <ScrollView
        horizontal={!layout.stacked}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "flex-start", paddingHorizontal: 8 }}
      >
        {content}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  terminal: {
    flex: 1,
    backgroundColor: DC_COLORS.terminalBg,
    borderRadius: DC_RADII.sm,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.15)",
    overflow: "hidden",
  },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  terminalDots: {
    flexDirection: "row",
    gap: 4,
  },
  terminalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  terminalTitle: {
    flex: 1,
    color: DC_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  terminalClose: {
    color: DC_COLORS.textMuted,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  terminalBody: {
    flex: 1,
    padding: 10,
    gap: 2,
  },
  terminalLine: {
    color: DC_COLORS.terminalText,
    fontSize: 10,
    fontFamily: "monospace",
  },
  screenIdle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  screenIdleText: {
    color: DC_COLORS.textFaint,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  screenIdleHint: {
    color: DC_COLORS.textFaint,
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 14,
  },
});
