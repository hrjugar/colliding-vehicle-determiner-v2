import { Outlet } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import BottomNavBar from "./BottomNavBar";


export default function AddModalLayout() {
  return (
    <div className="flex-grow flex flex-col justify-start items-stretch">
      <TopNavBar />
      <Outlet />
      <BottomNavBar />
    </div>
  );
}