"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { SETTING_TABS } from "../constants";

export function SettingNav() {
  const [search, setSearch] = useState("");
  const filteredTabs = SETTING_TABS.filter((tab) =>
    tab.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex w-1/4 shrink-0 flex-col gap-3">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="h-8 pl-8 text-sm"
        />
      </div>
      <ScrollArea className="flex-1">
        <TabsList className="h-auto w-full flex-col items-stretch gap-1 border-b-0">
          {filteredTabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "w-full justify-start gap-2 rounded-md border-b-0 px-3 py-2 text-left",
                "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                "hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
          {filteredTabs.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
          )}
        </TabsList>
      </ScrollArea>
    </div>
  );
}
