import { useAddModalStore } from "../../stores/useAddModalStore";

export default function AddPage() {
  const step = useAddModalStore(state => state.step);

  return (
    <main>
      <p>Add Page</p>
    </main>
  );
}