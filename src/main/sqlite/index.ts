import { db } from "./db";
import { setupAccidents } from "./tables/accidents";
import { setupSettings } from "./tables/settings";

const setupDatabase = () => {
  setupSettings();
  setupAccidents();
}

export { 
  db,
  setupDatabase,
};