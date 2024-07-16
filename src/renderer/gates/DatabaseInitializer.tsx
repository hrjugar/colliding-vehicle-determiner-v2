import { useEffect } from "react";
import { useAccidentsStore } from "../stores/useAccidentsStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { Outlet } from "react-router-dom";

export default function DatabaseInitializer() {
  const initSettings = useSettingsStore((state) => state.initSettings);
  const initAccidents = useAccidentsStore((state) => state.initAccidents);

  useEffect(() => {
    initSettings();
    initAccidents();
  }, []);

  return <Outlet />;
}