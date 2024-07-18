import { setupAccidents } from "./accidents"
import { setupSettings } from "./settings";

export const setupCollections = () => {
  setupSettings();
  setupAccidents();
}