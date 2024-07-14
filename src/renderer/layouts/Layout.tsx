import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideNavBar from "../components/SideNavBar";

export default function Layout() {
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