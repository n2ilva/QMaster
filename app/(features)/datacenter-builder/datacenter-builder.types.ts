export type CableType = 'ethernet' | 'fiber' | 'coaxial' | 'fiber_copper' | 'direct_attach';

export type Cable = {
  id: string;
  type: string;
  speed: string;
  max_distance?: string;
  use_case?: string;
};

export type DevicePort = string;

export type InventoryDevice = {
  id: string;
  label?: string;
  type: string;
  ports: DevicePort[];
  specs?: Record<string, any>;
};

export type RequiredConnection = {
  from: string; // "device.port"
  to: string;   // "device.port"
  cable: string; // cable id
  note?: string;
};

export type DataCenterLevel = {
  id: number;
  tier?: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'extreme';
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
  cables: Cable[];
  levels: DataCenterLevel[];
};

export type ActiveConnection = {
  id: string;
  from: { deviceId: string; port: string };
  to: { deviceId: string; port: string } | null;
  cableId: string;
};
