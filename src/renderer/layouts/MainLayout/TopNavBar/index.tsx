import SearchBar from "./SearchBar";
import AddButton from "./AddButton";

export default function TopNavBar() {
  return (
    <nav className="draggable w-full h-top-nav flex flex-row justify-center items-center p-4 border-b border-cool-gray-300">
      <div className="w-full h-full flex flex-row justify-end items-stretch gap-2">
        <SearchBar />
        <AddButton />
      </div>
    </nav>
  );
}