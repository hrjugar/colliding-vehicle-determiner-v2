import SearchBar from "./SearchBar";
import TabBar from "./TabBar";
import AddButton from "./AddButton";

export default function Navbar() {
  return (
    <nav className="draggable w-full flex flex-row justify-between items-center pl-24 px-6 p-4">
      <div className="w-full flex flex-row justify-end items-stretch gap-2 h-10">
        <TabBar />
        <SearchBar />
        <AddButton />
      </div>
    </nav>
  );
}