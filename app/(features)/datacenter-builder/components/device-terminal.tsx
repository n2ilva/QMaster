/**
 * DeviceTerminal
 * --------------
 * Interactive CLI-style terminal rendered inside the laptop screen when the
 * user connects the console cable to a device. Reads the device's
 * `cli_config` and `config_steps` from the level JSON and lets the user
 * actually type configuration commands — just like a real console session
 * against a MikroTik/Cisco/Linux box.
 *
 * Supported meta-commands:
 *
 *   ?              — lists all sections from the device manual
 *   help           — same as `?`
 *   help <section> — shows the commands of a specific section (by index or
 *                    section name substring)
 *   show config    — prints the commands you have already typed correctly
 *   clear          — clears the terminal buffer
 *   exit           — closes the console
 *
 * Any other input is matched against the union of commands declared in the
 * device's `cli_config[*].commands`. A recognized command marks itself as
 * executed. When every command of a section has been typed, the section's
 * `validation_token` is emitted via `onSectionCompleted` so the parent
 * screen can persist progress.
 *
 * Unknown commands produce a helpful error message hinting the user to
 * type `?` for help.
 *
 * This component is framework-aware (React Native / RN Web) and uses
 * only primitives that exist on both platforms.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { DC_COLORS } from "../datacenter-builder.constants";
import type {
    CliConfigSection,
    InventoryDevice,
} from "../datacenter-builder.types";

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

type LineKind = "sys" | "input" | "ok" | "warn" | "err" | "hint";

type TerminalLine = {
  id: number;
  kind: LineKind;
  text: string;
};

type Props = {
  device: InventoryDevice;
  onClose: () => void;
  /**
   * Called once a section's full command list has been typed successfully.
   * Parent can use the token to mark the level's sub-goal as complete.
   */
  onSectionCompleted?: (token: string, section: string) => void;
  /**
   * Called whenever the terminal's TextInput gains or loses focus.
   * Parent screens use this to scroll the laptop into view when the
   * soft keyboard opens on mobile / web mobile.
   */
  onInputFocusChange?: (focused: boolean) => void;
};

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

/** Normalize a CLI line for comparison — case-insensitive, collapse spaces. */
function normalizeCmd(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Build a flat index of every known command across all sections. */
function indexCommands(sections: CliConfigSection[]) {
  const byCmd = new Map<string, { sectionIdx: number; cmdIdx: number }>();
  sections.forEach((section, sectionIdx) => {
    section.commands.forEach((cmd, cmdIdx) => {
      byCmd.set(normalizeCmd(cmd), { sectionIdx, cmdIdx });
    });
  });
  return byCmd;
}

function kindColor(kind: LineKind): string {
  switch (kind) {
    case "input":
      return DC_COLORS.textPrimary;
    case "ok":
      return DC_COLORS.success;
    case "warn":
      return DC_COLORS.warning;
    case "err":
      return DC_COLORS.danger;
    case "hint":
      return DC_COLORS.accentSoft;
    case "sys":
    default:
      return DC_COLORS.textMuted;
  }
}

function detectDialect(device: InventoryDevice): "cisco_ios" | "mikrotik" | "linux" | "generic" {
  if (device.cli_dialect) return device.cli_dialect;
  const id = (device.id ?? "").toLowerCase();
  const type = (device.type ?? "").toLowerCase();
  if (id.includes("mikrotik")) return "mikrotik";
  if (id.includes("cisco") || id.includes("tp_link") || type === "switch")
    return "cisco_ios";
  if (id.includes("qnap") || id.includes("linux") || type.includes("server"))
    return "linux";
  return "generic";
}

function buildPrompt(device: InventoryDevice, dialect: string): string {
  if (device.prompt) return device.prompt;
  const base = (device.id ?? "device")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 16);
  switch (dialect) {
    case "cisco_ios":
      return `${base}#`;
    case "mikrotik":
      return `[admin@${base}] >`;
    case "linux":
      return `root@${base}:~#`;
    default:
      return `${base}>`;
  }
}

// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------

export function DeviceTerminal({
  device,
  onClose,
  onSectionCompleted,
  onInputFocusChange,
}: Props) {
  const dialect = useMemo(() => detectDialect(device), [device]);
  const prompt = useMemo(() => buildPrompt(device, dialect), [device, dialect]);

  const sections = useMemo<CliConfigSection[]>(
    () => device.cli_config ?? [],
    [device],
  );
  const commandIndex = useMemo(() => indexCommands(sections), [sections]);

  // lineId is a monotonic counter for stable keys
  const lineIdRef = useRef(0);
  const nextLineId = useCallback(() => {
    lineIdRef.current += 1;
    return lineIdRef.current;
  }, []);

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);

  // Per-section progress: which command indices have been typed.
  const [executed, setExecuted] = useState<Record<number, Set<number>>>({});
  const [completedTokens, setCompletedTokens] = useState<Set<string>>(new Set());

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const appendLines = useCallback(
    (items: Array<{ kind: LineKind; text: string }>) => {
      setLines((prev) => {
        const built = items.map((it) => ({
          id: nextLineId(),
          kind: it.kind,
          text: it.text,
        }));
        return [...prev, ...built];
      });
    },
    [nextLineId],
  );

  // Welcome banner — reset when device changes.
  useEffect(() => {
    lineIdRef.current = 0;
    setLines([]);
    setInput("");
    setHistory([]);
    setHistoryCursor(null);
    setExecuted({});
    setCompletedTokens(new Set());

    const banner: Array<{ kind: LineKind; text: string }> = [
      { kind: "sys", text: "D-SHELL v1.0 — console session" },
      {
        kind: "sys",
        text: `[${device.id}] connected via RS-232 @ 9600 8N1`,
      },
      {
        kind: "sys",
        text: `device: ${device.label ?? device.id} (${device.type})`,
      },
    ];
    if (sections.length > 0) {
      banner.push({
        kind: "hint",
        text: `manual: ${sections.length} section(s) available — type '?' for help`,
      });
    } else {
      banner.push({
        kind: "warn",
        text: "no CLI manual available for this device",
      });
    }
    appendLines(banner);
    // reset lineIdRef after appending (append already bumped it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.id]);

  // Auto-scroll on new lines.
  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 16);
    return () => clearTimeout(t);
  }, [lines.length]);

  // ---------------------------------------------------------------------
  // Meta-command handling
  // ---------------------------------------------------------------------

  const runHelp = useCallback(
    (arg?: string) => {
      if (sections.length === 0) {
        appendLines([
          { kind: "warn", text: "no CLI manual available for this device" },
        ]);
        return;
      }
      if (!arg) {
        appendLines([
          { kind: "sys", text: "Available configuration sections:" },
          ...sections.map((s, i) => ({
            kind: "hint" as LineKind,
            text: `  ${String(i + 1).padStart(2, "0")}. ${s.section}${
              s.validation_token && completedTokens.has(s.validation_token)
                ? "  [OK]"
                : ""
            }`,
          })),
          {
            kind: "sys",
            text: "Type 'help <n>' or 'help <keyword>' for a section's commands.",
          },
          {
            kind: "sys",
            text: "Other meta-commands: show config | clear | exit",
          },
        ]);
        return;
      }
      // Try numeric index first.
      let target: CliConfigSection | undefined;
      const asNum = Number.parseInt(arg, 10);
      if (!Number.isNaN(asNum) && asNum >= 1 && asNum <= sections.length) {
        target = sections[asNum - 1];
      } else {
        const needle = arg.toLowerCase();
        target = sections.find((s) => s.section.toLowerCase().includes(needle));
      }
      if (!target) {
        appendLines([
          { kind: "err", text: `no section matches '${arg}'` },
          { kind: "hint", text: "type '?' to list all sections" },
        ]);
        return;
      }
      const sectionIdx = sections.indexOf(target);
      const done = executed[sectionIdx] ?? new Set<number>();
      appendLines([
        { kind: "sys", text: `[${target.section}]` },
        ...target.commands.map((c, i) => ({
          kind: "hint" as LineKind,
          text: `  ${done.has(i) ? "✓" : "·"} ${c}`,
        })),
      ]);
    },
    [sections, appendLines, executed, completedTokens],
  );

  const runShowConfig = useCallback(() => {
    const entries: string[] = [];
    sections.forEach((section, sIdx) => {
      const done = executed[sIdx];
      if (!done || done.size === 0) return;
      entries.push(`! ${section.section}`);
      section.commands.forEach((cmd, cIdx) => {
        if (done.has(cIdx)) entries.push(cmd);
      });
    });
    if (entries.length === 0) {
      appendLines([
        {
          kind: "warn",
          text: "no commands configured yet — type '?' to see the manual",
        },
      ]);
      return;
    }
    appendLines([
      { kind: "sys", text: "!-- running config --" },
      ...entries.map((line) => ({
        kind: line.startsWith("!") ? ("sys" as LineKind) : ("ok" as LineKind),
        text: line,
      })),
      { kind: "sys", text: "!-- end --" },
    ]);
  }, [sections, executed, appendLines]);

  // ---------------------------------------------------------------------
  // Command dispatcher
  // ---------------------------------------------------------------------

  const submit = useCallback(
    (rawInput: string) => {
      const raw = rawInput.trim();
      if (!raw) return;

      // Echo the typed line.
      appendLines([{ kind: "input", text: `${prompt} ${raw}` }]);
      setHistory((h) => (h[h.length - 1] === raw ? h : [...h, raw]));
      setHistoryCursor(null);

      const lower = raw.toLowerCase();

      // Meta commands
      if (lower === "?" || lower === "help") {
        runHelp();
        return;
      }
      if (lower.startsWith("help ")) {
        runHelp(raw.slice(5).trim());
        return;
      }
      if (lower === "clear" || lower === "cls") {
        setLines([]);
        return;
      }
      if (lower === "exit" || lower === "quit" || lower === "logout") {
        appendLines([{ kind: "sys", text: "closing session..." }]);
        setTimeout(onClose, 150);
        return;
      }
      if (lower === "show config" || lower === "show running-config") {
        runShowConfig();
        return;
      }

      // Real command matching
      const norm = normalizeCmd(raw);
      const hit = commandIndex.get(norm);
      if (!hit) {
        appendLines([
          { kind: "err", text: `% unknown command: ${raw}` },
          { kind: "hint", text: "type '?' for help" },
        ]);
        return;
      }

      const section = sections[hit.sectionIdx];
      setExecuted((prev) => {
        const current = new Set(prev[hit.sectionIdx] ?? []);
        const already = current.has(hit.cmdIdx);
        current.add(hit.cmdIdx);
        const next = { ...prev, [hit.sectionIdx]: current };

        // Check section completion (after this update).
        if (
          !already &&
          current.size === section.commands.length &&
          section.validation_token &&
          !completedTokens.has(section.validation_token)
        ) {
          const token = section.validation_token;
          setCompletedTokens((toks) => {
            if (toks.has(token)) return toks;
            const merged = new Set(toks);
            merged.add(token);
            return merged;
          });
          // Defer side-effects until after state commit.
          setTimeout(() => {
            appendLines([
              {
                kind: "ok",
                text: `[OK] section '${section.section}' complete`,
              },
            ]);
            onSectionCompleted?.(token, section.section);
          }, 0);
        }
        return next;
      });

      appendLines([{ kind: "ok", text: "ok" }]);
    },
    [
      prompt,
      appendLines,
      commandIndex,
      sections,
      runHelp,
      runShowConfig,
      onClose,
      onSectionCompleted,
      completedTokens,
    ],
  );

  // ---------------------------------------------------------------------
  // Key handling for history navigation (web-only friendly)
  // ---------------------------------------------------------------------

  const onKeyPress = useCallback(
    (e: { nativeEvent: { key: string } }) => {
      const key = e.nativeEvent.key;
      if (key === "Enter") return;
      if (key === "ArrowUp") {
        if (history.length === 0) return;
        const nextIdx =
          historyCursor === null
            ? history.length - 1
            : Math.max(0, historyCursor - 1);
        setHistoryCursor(nextIdx);
        setInput(history[nextIdx]);
      } else if (key === "ArrowDown") {
        if (historyCursor === null) return;
        const nextIdx = historyCursor + 1;
        if (nextIdx >= history.length) {
          setHistoryCursor(null);
          setInput("");
        } else {
          setHistoryCursor(nextIdx);
          setInput(history[nextIdx]);
        }
      }
    },
    [history, historyCursor],
  );

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  return (
    <View style={styles.terminal}>
      <View style={styles.header}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
          <View style={[styles.dot, { backgroundColor: "#F59E0B" }]} />
          <View style={[styles.dot, { backgroundColor: "#22C55E" }]} />
        </View>
        <Text style={styles.title} numberOfLines={1}>
          CONSOLE · {(device.label ?? device.id).toUpperCase()}
        </Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar console"
          hitSlop={6}
        >
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.bodyWrap}
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="none"
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {lines.map((line) => (
            <Text
              key={line.id}
              style={[styles.line, { color: kindColor(line.kind) }]}
              selectable
            >
              {line.text}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <Text style={styles.promptText} numberOfLines={1}>
            {prompt}
          </Text>
          <TextInput
            ref={inputRef}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => {
              submit(input);
              setInput("");
            }}
            onKeyPress={onKeyPress}
            onFocus={() => onInputFocusChange?.(true)}
            onBlur={() => onInputFocusChange?.(false)}
            placeholder="type a command or '?' for help"
            placeholderTextColor={DC_COLORS.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="send"
            blurOnSubmit={false}
            style={styles.input}
            // Web: keep the caret visible without a border ring
            {...(Platform.OS === "web" ? { autoFocus: true } : {})}
          />
        </View>
      </Pressable>
    </View>
  );
}

// -------------------------------------------------------------------------
// Styles
// -------------------------------------------------------------------------

const styles = StyleSheet.create({
  terminal: {
    flex: 1,
    backgroundColor: "#05070A",
    borderRadius: 6,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  dots: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    flex: 1,
    color: DC_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  close: {
    color: DC_COLORS.textMuted,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  bodyWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
    gap: 2,
  },
  line: {
    color: DC_COLORS.textSecondary,
    fontSize: 10,
    fontFamily: Platform.OS === "web" ? "monospace" : "Courier",
    lineHeight: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.02)",
    gap: 6,
  },
  promptText: {
    color: DC_COLORS.accentSoft,
    fontSize: 10,
    fontFamily: Platform.OS === "web" ? "monospace" : "Courier",
    fontWeight: "700",
  },
  input: {
    flex: 1,
    color: DC_COLORS.textPrimary,
    fontSize: 10,
    fontFamily: Platform.OS === "web" ? "monospace" : "Courier",
    padding: 0,
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", outlineWidth: 0 } as unknown as object)
      : {}),
  },
});
