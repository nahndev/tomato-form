"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { DEFAULT_SETTING_TAB, SETTING_TABS } from "../constants";
import { SettingNav } from "./SettingNav";

const SettingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(DEFAULT_SETTING_TAB);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      orientation="vertical"
      className="flex h-[80vh] w-[120vh] flex-row gap-4"
    >
      <SettingNav />
      <ScrollArea className="flex-1 border-l border-border pl-4">
        {SETTING_TABS.map(({ value, content: Content }) => (
          <TabsContent key={value} value={value} className="mt-0">
            <Content />
          </TabsContent>
        ))}
      </ScrollArea>
    </Tabs>
  );
};

export default SettingContent;
