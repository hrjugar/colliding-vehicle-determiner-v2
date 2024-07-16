export interface AccidentInput {
  name: string;
  collidingVehicle: 0 | 1 | 2;
}

export interface Accident extends AccidentInput {
  id: number;
  dateCreated: string;
}

export type LayoutSetting = 'grid' | 'table';
export type SortBySetting = 'name' | 'date';
export type OrderSetting = 'asc' | 'desc';
export type CollisionStatusSetting = 'all' | 'collision' | 'no-collision';

export interface Settings {
  'layout': LayoutSetting;
  'sortBy': SortBySetting;
  'order': OrderSetting;
  'collisionStatus': CollisionStatusSetting;
}

export type Setting = {
  name: 'layout',
  value: LayoutSetting
} | {
  name: 'sortBy',
  value: SortBySetting
} | {
  name: 'order',
  value: OrderSetting
} | {
  name: 'collisionStatus',
  value: CollisionStatusSetting
}