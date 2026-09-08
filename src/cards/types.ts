export type CardPropertyType = "text" | "number" | "color" | "select" | "boolean" | "image" | "video";

export interface CardProperty {
  key: string;
  label: string;
  type: CardPropertyType;
  defaultValue: unknown;
  options?: string[];
}

export interface MediaSlot {
  key: string;
  label: string;
  type: "image" | "video";
  required: boolean;
}

export interface CardManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  defaultDuration: number;
  source: string;
  properties: CardProperty[];
  mediaSlots: MediaSlot[];
}
