interface AccidentItemProps {

}

export default function AccidentItem({} : AccidentItemProps) {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2">
      <div className="w-full h-full aspect-video bg-cool-gray-100 border border-cool-gray-200" />

      <div className="w-full flex flex-col justify-start items-start">
        <p className="text-base leading-none text-cool-gray-500">Accident 1</p>
        <p className="text-sm text-cool-gray-400">Created 4 hours ago</p>
      </div>
    </div>
  )
}