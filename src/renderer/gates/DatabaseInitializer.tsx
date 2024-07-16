import { useEffect } from "react";
import { useAccidentsStore } from "../stores/useAccidentsStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { Outlet } from "react-router-dom";
import { useMutation } from "react-query";

export default function DatabaseInitializer() {
  const initSettings = useSettingsStore((state) => state.initSettings);
  const initAccidents = useAccidentsStore((state) => state.initAccidents);
  
  const initMutation = useMutation({
    mutationFn: async () => {
      await initSettings();
      await initAccidents();
    },
  });

  useEffect(() => {
    // initMutation.mutate();
    initSettings();
    initAccidents();
  }, []);

  // if (initMutation.status === 'success') {
  //   return <Outlet />;
  // }

  // return (
  //   <></>
  // );

  return <Outlet />;
}