import { RemixiconComponentType, RiLayoutGridLine, RiListUnordered } from "@remixicon/react";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { LayoutSettingValue } from "../../../main/types";

interface Tab {
  icon: RemixiconComponentType;
  layout: LayoutSettingValue;
}

const tabs: Tab[] = [
  {
    icon: RiLayoutGridLine,
    layout: 'grid',
  },
  {
    icon: RiListUnordered,
    layout: 'table',
  }
];

export default function LayoutTabBar() {
  const layout = useSettingsStore((state) => state.settings.layout);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  return (
    <div className="flex flex-row justify-center items-center bg-cool-gray-100 rounded-lg">
      {tabs.map((tab) => (
        <button
          className={`
            rounded-lg px-2.5 py-2 border
            ${tab.layout === layout ? (
              'bg-white border-cool-gray-200 text-indigo-400'
            ) : (
              'bg-transparent border-transparent text-cool-gray-400 hover:text-cool-gray-500'
            )}
          `}
          key={`layout-tab-${tab.layout}`}
          onClick={() => updateSetting({ name: 'layout', value: tab.layout })}
        >
          <tab.icon size={18} />
        </button>
      ))}
    </div>
  )
}
