export type CableType =
  | "ethernet"
  | "fiber"
  | "coaxial"
  | "fiber_copper"
  | "direct_attach"
  | "console";

export type Cable = {
  id: string;
  type: string;
  speed: string;
  max_distance?: string;
  use_case?: string;
};

export type DevicePort = {
  id: string;
  label?: string;
  mode?: "access" | "trunk";
  ip?: string;
  mask?: string;
  gateway?: string;
  vlan?: number | null;
  config_commands?: string[];
  validation_token?: string;
};

/**
 * A single CLI "section" from the manual of a device. Groups related
 * commands (e.g. "WAN DHCP client", "VLAN 10 creation") with a validation
 * token used to mark the section as completed when the user types them all.
 */
export type CliConfigSection = {
  section: string;
  commands: string[];
  validation_token?: string;
  description?: string;
};

export type InventoryDevice = {
  id: string;
  label?: string;
  type: string;
  ports: DevicePort[];
  specs?: Record<string, any>;
  config_steps?: string[];
  cli_config?: CliConfigSection[];
  /** Optional explicit CLI prompt prefix, e.g. "RouterA" for `RouterA#`. */
  prompt?: string;
  /** Optional CLI dialect hint: affects help text and prompt style. */
  cli_dialect?: "cisco_ios" | "mikrotik" | "linux" | "generic";
};

export type RequiredConnection = {
  from: string;
  to: string;
  cable: string;
  note?: string;
};

export type DataCenterLevel = {
  id: number;
  tier?: string;
  name: string;
  difficulty: "easy" | "medium" | "hard" | "expert" | "extreme";
  description?: string;
  inventory: InventoryDevice[];
  connections_required: RequiredConnection[];
  rules?: string[];
  vlans?: any[];
  virtual_machines?: any[];
};

export type DataCenterData = {
  game: {
    name: string;
    version: string;
  };
  cable_types: Cable[];
  levels: DataCenterLevel[];
};

export type ActiveConnection = {
  id: string;
  from: { deviceId: string; port: string };
  to: { deviceId: string; port: string } | null;
  cableId: string;
};

export type DevicePortConfig = {
  deviceId: string;
  portId: string;
  commands: string[];
};

/**
 * Runtime status of a single port. Used by the rack SVG to decide whether
 * the per-port LED should blink (red/orange) or stay solid (green).
 *
 * - "idle"    — no cable attached yet.
 * - "ok"      — cable attached and matches the expected `cable` from
 *               the level's `connections_required` (or port has no requirement).
 * - "wrong"   — cable attached but its `cableId` does not match the expected one.
 * - "unneeded" — cable attached on a port that isn't part of any required
 *                connection (treated as wrong to nudge the user).
 */
export type PortStatus = "idle" | "ok" | "wrong" | "unneeded";

/** Map keyed by `${deviceId}.${portId}` → status. */
export type PortStatusMap = Record<string, PortStatus>;
