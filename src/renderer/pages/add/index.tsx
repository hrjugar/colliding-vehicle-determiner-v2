import { useAddModalStore } from "../../stores/useAddModalStore";
import AddStepOne from "./AddStepOne";

export default function AddPage() {
  const step = useAddModalStore(state => state.step);
  
  switch (step) {
    case 1:
      return <AddStepOne />;
    case 2:
      return <p>Add Step Two</p>;
    case 3:
      return <p>Add Step Three</p>;
  }
}