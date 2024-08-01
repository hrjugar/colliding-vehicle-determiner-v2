import { useEffect } from "react";
import { useAccidentsStore } from "../stores/useAccidentsStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { Outlet } from "react-router-dom";
import { useServerConfigStore } from "../stores/useServerConfigStore";
import { useMutation } from "react-query";

export default function DatabaseInitializer() {
  const initSettings = useSettingsStore((state) => state.initSettings);
  const initAccidents = useAccidentsStore((state) => state.initAccidents);
  const initServerConfig = useServerConfigStore((state) => state.initServerConfig);

  const initMutation = useMutation({
    mutationFn: async () => {
      await initSettings();
      await initAccidents();
      await initServerConfig();
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