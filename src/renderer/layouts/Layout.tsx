import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideNavBar from "../components/SideNavBar";

export default function Layout() {
  return (
    <>
      <SideNavBar />
      <div className="flex-grow flex flex-col justify-start items-stretch">
        <TopNavBar />
        <Outlet />
      </div>
    </>
  )
}