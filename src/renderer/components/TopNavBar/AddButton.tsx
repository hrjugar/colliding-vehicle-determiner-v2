import { RiBubbleChartLine } from "@remixicon/react"
import { useAccidentsStore } from "../../stores/useAccidentsStore"
import { useMutation } from "react-query";

export default function AddButton() {
  const findAccident = useAccidentsStore((state) => state.findAccident);
  const addAccident = useAccidentsStore((state) => state.addAccident); // TEMPORARY ONLY

  // const findAccidentMutation = useMutation({
  //   mutationFn: findAccident,
  //   onSuccess(data) {
  //     if (data !== null) {
  //       console.log(`Found accident: ${data}`);
  //       let fileName = data.split('/').pop() ?? data;
  //       addAccident({
  //         name: fileName,
  //         collidingVehicle: 0
  //       })
  //     }
  //   }
  // });

  const openSecondaryWindowMutation = useMutation({
    mutationFn: () => window.electron.modalWindow.open()
  });

  return (
    <button 
      className="non-draggable h-full flex flex-row justify-start items-center gap-2.5 px-4 rounded-xl text-sm font-medium whitespace-nowrap transition-colors bg-indigo-400 text-cool-gray-50 hover:bg-indigo-500 hover:text-cool-gray-100"
      onClick={() => openSecondaryWindowMutation.mutate()}
    >
      <RiBubbleChartLine size={18} />
      <span>Analyze Accident</span>
    </button>
  )
}