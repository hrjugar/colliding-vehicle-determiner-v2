import { useEffect } from "react";
import { useAccidentsStore } from "../stores/useAccidentsStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { Outlet } from "react-router-dom";
import { useOsStore } from "../stores/useOsStore";
import { useMutation } from "react-query";

export default function DatabaseInitializer() {
  const initSettings = useSettingsStore((state) => state.initSettings);
  const initAccidents = useAccidentsStore((state) => state.initAccidents);
  const initOs = useOsStore((state) => state.initOs);

  const initMutation = useMutation({
    mutationFn: async () => {
      await initSettings();
      await initAccidents();
      await initOs();
    },
  })

  useEffect(() => {
    initMutation.mutate();
  }, []);

  if (initMutation.status === 'success') {
    return <Outlet />;
  }

  return <></>;
}