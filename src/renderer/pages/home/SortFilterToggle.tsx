import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { RiArrowDropDownLine } from "@remixicon/react";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { Setting, SettingName, Settings } from "../../../types";
import { useMemo } from "react";

interface SortFilterToggleProps<TSettingName extends SettingName> {
  displayName: string;
  settingName: TSettingName;
  options: {
    displayName: string,
    value: Settings[TSettingName],
  }[];
}

export default function SortFilterToggle<TSettingName extends SettingName>({
  displayName,
  settingName,
  options
}: SortFilterToggleProps<TSettingName>) {
  const currValue = useSettingsStore((state) => state.settings[settingName]);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  const currValueDisplayName = useMemo(
    () => options.find((option) => option.value === currValue)?.displayName, 
    [displayName, currValue]
  );
  
  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton 
            className={`
              relative flex flex-row justify-start items-center cursor-pointer focus:outline-none
              ${open ? 'text-cool-gray-600' : 'text-cool-gray-500 hover:text-cool-gray-600'}
            `}
          >
            <p>{displayName}: {currValueDisplayName}</p>
            <RiArrowDropDownLine size={18} />
          </PopoverButton>

          <PopoverPanel 
            className="min-w-40 bg-white border border-cool-gray-200 py-3 pl-3 pr-12 text-sm rounded-md shadow-md"
            anchor={{
              to: 'bottom start',
              gap: '4px'
            }}
          >
            {({ close }) => (
              <ul className="flex flex-col justify-start items-start gap-1">
                {options.map((option) => (
                  <button
                    key={`toggle-option-${displayName}-${option.value}`}
                    className={`
                      cursor-pointer
                      ${currValue === option.value ? 'text-indigo-400' : 'text-cool-gray-500 hover:text-cool-gray-600 '}
                    `}
                    onClick={() => {
                      updateSetting({ name: settingName, value: option.value } as Setting);
                      close();
                    }}
                  >
                    {option.displayName}
                  </button>
                ))}
              </ul>
            )}
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}