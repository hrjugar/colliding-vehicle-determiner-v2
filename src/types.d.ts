export interface AccidentInput {
  name: string;
  collidingVehicle: 0 | 1 | 2;
}

export interface Accident extends AccidentInput {
  id: number;
  dateCreated: string;
}

export type LayoutSettingValue = 'grid' | 'table';
export type SortBySettingValue = 'name' | 'date';
export type OrderSettingValue = 'asc' | 'desc';
export type CollisionStatusSettingValue = 'all' | 'collision' | 'no-collision';
export type ProjectsDirSettingValue = string;

export interface Settings {
  'layout': LayoutSettingValue;
  'sortBy': SortBySettingValue;
  'order': OrderSettingValue;
  'collisionStatus': CollisionStatusSettingValue;
  'projectsDir': ProjectsDirSettingValue;
}

export type SettingName = keyof Settings;

export type Setting = {
  [K in keyof Settings]: {
    name: K;
    value: Settings[K];
  }
}[keyof Settings];

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}