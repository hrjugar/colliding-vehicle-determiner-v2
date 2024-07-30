import { Outlet } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import SideNavBar from "./SideNavBar";

export default function MainLayout() {
  return (
    <>
      <SideNavBar />
      <div className="w-full flex flex-col justify-start items-stretch">
        <TopNavBar />
        <Outlet />
      </div>
    </>
  )
}