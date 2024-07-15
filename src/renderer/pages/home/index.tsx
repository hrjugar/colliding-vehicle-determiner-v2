import { RiArrowDropDownLine } from "@remixicon/react";
import LayoutTabBar from "./LayoutTabBar";
import AccidentItem from "./AccidentItem";
import { useSettingsStore } from "../../stores/useSettingsStore";

export default function HomePage() {
  const settings = useSettingsStore((state) => state.settings);

  return (
    <main className="flex flex-col justify-start items-stretch gap-4">
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm text-cool-gray-700">20 results</p>

        <p>{settings.layout}</p>

        <div className="flex flex-row justify-end items-center gap-4 text-sm text-cool-gray-500">
          <div className="flex flex-row justify-start items-center cursor-pointer hover:text-cool-gray-600">
            <p>Sort by: Name</p>
            <RiArrowDropDownLine size={18} />
          </div>

          <div className="flex flex-row justify-start items-center cursor-pointer hover:text-cool-gray-600">
            <p>Order: Ascending</p>
            <RiArrowDropDownLine size={18} />
          </div>

          <LayoutTabBar />
        </div>
      </div>

      <div className="grid grid-cols-search-results gap-4">
        {Array(20).fill(0).map((_, index) => (
          <AccidentItem key={`accident-item-${index}`} />
        ))}
      </div>
    </main>
  )
}