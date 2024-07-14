import { RiLayoutGridLine, RiListUnordered } from "@remixicon/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    icon: RiLayoutGridLine,
  },
  {
    icon: RiListUnordered,
  }
];

export default function LayoutTabBar() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  return (
    <div className="flex flex-row justify-center items-center bg-cool-gray-100 rounded-lg">
      {tabs.map((tab, index) => (
        <button
          className={`
            rounded-lg px-2.5 py-2 border
            ${activeTabIndex === index ? (
              'bg-white border-cool-gray-200 text-indigo-400'
            ) : (
              'bg-transparent border-transparent text-cool-gray-400 hover:text-cool-gray-500'
            )}
          `}
          key={`layout-tab-${index}`}
          onClick={() => {
            setActiveTabIndex(index);
            // TODO: IMPLEMENT LAYOUT CHANGE HERE
          }}
        >
          <tab.icon size={18} />
        </button>
      ))}
    </div>
  )
}
