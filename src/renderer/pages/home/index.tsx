import { RiArrowDropDownLine } from "@remixicon/react";
import LayoutTabBar from "./LayoutTabBar";
import { useSettingsStore } from "../../stores/useSettingsStore";
import AccidentGrid from "./AccidentGrid";
import AccidentTable from "./AccidentTable";

export default function HomePage() {
  const settings = useSettingsStore((state) => state.settings);

  return (
    <main className="flex flex-col justify-start items-stretch gap-4 pb-4">
      <div className="flex flex-row justify-between items-center whitespace-nowrap">
        <p className="text-sm text-cool-gray-700">20 results</p>

        <div className="flex flex-row justify-end items-center gap-4 text-sm text-cool-gray-500">
          <div className="flex flex-row justify-start items-center cursor-pointer hover:text-cool-gray-600">
            <p>Sort by: Name</p>
            <RiArrowDropDownLine size={18} />
          </div>

          <div className="flex flex-row justify-start items-center cursor-pointer hover:text-cool-gray-600">
            <p>Order: Ascending</p>
            <RiArrowDropDownLine size={18} />
          </div>

          <div className="flex flex-row justify-start items-center cursor-pointer hover:text-cool-gray-600">
            <p>Collision: All</p>
            <RiArrowDropDownLine size={18} />
          </div>

          <LayoutTabBar />
        </div>
      </div>

      {settings.layout === 'grid' ? (
        <AccidentGrid />
      ) : (
        <AccidentTable />
      )}
    </main>
  )
}