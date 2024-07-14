import { RiBarChart2Line, RiFolderVideoLine, RiSettings5Line } from "@remixicon/react";
import { SideNavTabProps } from "./types";
import SideNavTab from "./SideNavTab";

const mainTabs: SideNavTabProps[] = [
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

const secondaryTabs = [
  {
    icon: RiSettings5Line,
    url: "/settings",
    name: "Settings"
  }
];


export default function SideNavBar() {
  return (
    <nav className="w-side-nav flex flex-col justify-start items-stretch gap-4 pb-4 border-r border-cool-gray-300">
      <div className="draggable w-full h-top-nav" />

      <div className="flex-grow flex flex-col justify-between items-stretch px-4">
        <div className="w-full flex flex-col justify-start items-stretch">
          {mainTabs.map((tab, index) => (
            <SideNavTab 
              key={`side-nav-primary-tab-${index}`}
              icon={tab.icon}
              url={tab.url}
              name={tab.name}
            />
          ))}
        </div>

        <div className="w-full flex flex-col justify-end items-stretch">
          {secondaryTabs.map((tab, index) => (
            <SideNavTab 
              key={`side-nav-secondary-tab-${index}`}
              icon={tab.icon}
              url={tab.url}
              name={tab.name}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}