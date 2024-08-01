import { Outlet } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import StepperControls from "../../components/add-modal/StepperControls";
import { useAddModalStore } from "../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useMutation } from "react-query";


export default function AddModalLayout() {
  const [
    filePath,
    initAddModal,
  ] = useAddModalStore(
    useShallow((state) => [
      state.filePath,
      state.initAddModal,
    ])
  );

  const initMutation = useMutation({
    mutationFn: async () => await initAddModal()
  })

  useEffect(() => {
    initMutation.mutate();
  }, []);

  return (
    <div className="relative h-screen flex-grow flex flex-col justify-start items-stretch overflow-hidden">
      <TopNavBar />
      {filePath && (
        <>
          <Outlet />
        </>
      )}
    </div>
  );
}