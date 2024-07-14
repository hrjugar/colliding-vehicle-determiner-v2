import { RiFolderVideoLine, RiBarChart2Line } from "@remixicon/react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    icon: RiFolderVideoLine,
    url: "/",
    name: "Accidents"
  },
  {
    icon: RiBarChart2Line,
    url: "/stats",
    name: "Statistics"
  }
];

export default function TabBar() {
  return (
    <div className="non-draggable flex flex-row justify-center items-center px-1 bg-cool-gray-100 rounded-xl">
      {tabs.map((tab, index) => (
        <NavLink 
          to={tab.url} 
          key={`nav-tab-${index}`} 
          className={({ isActive }) => `group flex flex-row justify-center items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${isActive ? 'bg-white border-gray-200' : 'border-transparent'}`}
        >
          {({ isActive }) => (
            <>
              <tab.icon size={18} className={`rounded-lg transition-colors ${isActive ? 'text-indigo-400' : 'text-cool-gray-400 group-hover:text-cool-gray-500'}`} />
              <span className={`text-xs transition-colors ${isActive ? 'text-indigo-400' : 'text-cool-gray-400 group-hover:text-cool-gray-500'}`}>
                {tab.name}
              </span>
            </>
          )}
          </NavLink>
      ))}
    </div>
  )
}
