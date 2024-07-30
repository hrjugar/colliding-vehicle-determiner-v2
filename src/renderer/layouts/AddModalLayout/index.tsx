import { Outlet } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import BottomNavBar from "./BottomNavBar";
import { useAddModalStore } from "../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useMutation } from "react-query";


export default function AddModalLayout() {
  const [
    fileName,
    initAddModal,
  ] = useAddModalStore(
    useShallow((state) => [
      state.fileName,
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
    <div className="flex-grow flex flex-col justify-start items-stretch">
      <TopNavBar />
      <p>FileName: {fileName}</p>
      {fileName && (
        <>
          <Outlet />
          <BottomNavBar />
        </>
      )}
    </div>
  );
}