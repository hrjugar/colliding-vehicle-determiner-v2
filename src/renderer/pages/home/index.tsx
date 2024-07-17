import LayoutTabBar from "./LayoutTabBar";
import { useSettingsStore } from "../../stores/useSettingsStore";
import AccidentGrid from "./AccidentGrid";
import AccidentTable from "./AccidentTable";
import SortFilterToggle from "./SortFilterToggle";
import { useAccidentsStore } from "../../stores/useAccidentsStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAccidentItemsStore } from "./useAccidentItemsStore";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const settings = useSettingsStore((state) => state.settings);
  const unselectAllItems = useAccidentItemsStore((state) => state.unselectAllItems);
  
  const [
    accidents,
    getProcessedAccidents
  ] = useAccidentsStore(
    useShallow((state) => [
      state.accidents,
      state.getProcessedAccidents
    ])
  );

  const processedAccidents = useMemo(() => {
    return getProcessedAccidents(
      {
        sort: settings.sortBy as ("name" | "date"),
        order: settings.order as ("asc" | "desc"),
      },
      {
        name: searchParams.get('search') || '',
        collisionStatus: settings.collisionStatus,
      }
    );
  }, [accidents, searchParams, settings]);

  useEffect(() => {
    document.addEventListener('click', unselectAllItems);
    return () => {
      unselectAllItems();
      document.removeEventListener('click', unselectAllItems);
    }
  }, [unselectAllItems]);

  return (
    <main className="flex flex-col justify-start items-stretch gap-4 pb-4">
      <div className="flex flex-row justify-between items-center whitespace-nowrap">
        <p className="text-sm text-cool-gray-700">{processedAccidents.length} result{processedAccidents.length === 1 ? '' : 's'}</p>

        <div className="flex flex-row justify-end items-center gap-4 text-sm text-cool-gray-500">
          <SortFilterToggle
            displayName="Sort By"
            settingName='sortBy'
            options={[
              { displayName: 'Name', value: 'name' },
              { displayName: 'Date', value: 'date' }
            ]}
          />

          <SortFilterToggle
            displayName="Order"
            settingName='order'
            options={[
              { displayName: 'Ascending', value: 'asc' },
              { displayName: 'Descending', value: 'desc' }
            ]}
          />

          <SortFilterToggle 
            displayName="Collision"
            settingName='collisionStatus'
            options={[
              { displayName: 'All', value: 'all' },
              { displayName: 'Collision', value: 'collision' },
              { displayName: 'No Collision', value: 'no-collision' }
            ]}
          />

          <LayoutTabBar />
        </div>
      </div>

      {processedAccidents.length === 0 ? (
        <>
          <div className="flex-grow flex justify-center items-center">
            <p className="text-cool-gray-400">No videos uploaded.</p>
          </div>
        </>
      ) : settings.layout === 'grid' ? (
        <AccidentGrid processedAccidents={processedAccidents} />
      ) : (
        <AccidentTable />
      )}
    </main>
  )
}