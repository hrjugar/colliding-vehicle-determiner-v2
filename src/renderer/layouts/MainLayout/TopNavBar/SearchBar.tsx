import { RiSearchLine } from "@remixicon/react"
import { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({
      pathname: "/",
      ...(searchText ? {
        search: createSearchParams({
          search: searchText
        }).toString()
      } : {})
    });
  };

  useEffect(() => {
    if (!location.search) {
      setSearchText("");
    }
  }, [location.pathname]);

  return (
    <form 
      className="non-draggable flex-grow flex flex-row justify-start items-center p-4 gap-2.5 bg-cool-gray-100 rounded-xl"
      onSubmit={handleSubmit}
    >
      <button type="submit" className="group">
        <RiSearchLine size={18} className="transition-colors text-cool-gray-400 group-hover:text-cool-gray-500" />
      </button>

      <input 
        type="text"
        className="flex-grow bg-transparent placeholder-cool-gray-400 text-cool-gray-400 text-sm" 
        placeholder="Search" 
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />

      <input type="submit" hidden />
    </form>
  )
}