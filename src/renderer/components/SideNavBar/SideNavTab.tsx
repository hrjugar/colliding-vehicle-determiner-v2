import { NavLink } from "react-router-dom";
import { SideNavTabProps } from "./types";

export default function SideNavTab({
  icon: Icon,
  url,
  name
}: SideNavTabProps) {
  return (
    <NavLink 
      to={url} 
      className={({ isActive }) => `
        flex-grow flex flex-row justify-start items-center gap-1.5 p-2 rounded-lg
        ${isActive ? (
          'text-indigo-400 bg-cool-gray-100'
        ) : (
          'text-cool-gray-400 hover:text-cool-gray-500'
        )}
      `}
    >
      <Icon size={18} />
      <span className="text-sm font-semibold">{name}</span>
    </NavLink>
  )
}