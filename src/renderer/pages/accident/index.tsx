import { useParams } from "react-router-dom"

export default function AccidentPage() {
  const { id } = useParams();

  return (
    <main>
      <p>Accident Page</p>
      <p>{id}</p>
    </main>
  )
}