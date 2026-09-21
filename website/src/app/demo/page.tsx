"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { EventInterface, SubjectInterface, Timeline } from "@tomato/timeline";
import { useState } from "react";
import { v4 } from "uuid";

const ALICE = v4();
const BOB = v4();
const CARLA = v4();

const DEMO_SUBJECTS: SubjectInterface[] = [
  { uuid: ALICE, name: "Alice Nguyen", avatar: "" },
  { uuid: BOB, name: "Bob Tran", avatar: "" },
  { uuid: CARLA, name: "Carla Pham", avatar: "" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function getTodayStart(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

const TODAY = getTodayStart();

const DEMO_EVENTS: EventInterface[] = [
  {
    uuid: v4(),
    title: "Design review",
    start: TODAY,
    end: TODAY + DAY_MS,
    subject: ALICE,
    color: "#f97316",
  },
  {
    uuid: v4(),
    title: "Sprint planning",
    start: TODAY + DAY_MS,
    end: TODAY + 3 * DAY_MS,
    subject: BOB,
    color: "#3b82f6",
  },
  {
    uuid: v4(),
    title: "Client demo",
    start: TODAY + 4 * DAY_MS,
    end: TODAY + 5 * DAY_MS,
    subject: CARLA,
    color: "#22c55e",
  },
];

export default function TimelineDemoPage() {
  const [events, setEvents] = useState<EventInterface[]>(DEMO_EVENTS);

  const handleEventMove = (uuid: string, start: number, end: number) => {
    console.log(uuid, start, end);
    setEvents((current) =>
      current.map((event) =>
        event.uuid === uuid ? { ...event, start, end } : event,
      ),
    );
  };

  const handleEventResize = (uuid: string, start: number, end: number) => {
    setEvents((current) =>
      current.map((event) =>
        event.uuid === uuid ? { ...event, start, end } : event,
      ),
    );
  };

  const handleEventCreate = (event: EventInterface) => {
    setEvents((current) => [...current, event]);
  };

  return (
    <div className="flex h-screen flex-col gap-3 p-4">
      <h1 className="text-lg font-semibold">Timeline demo</h1>
      <DragDropProvider>
        <Timeline
          subjects={DEMO_SUBJECTS}
          events={events}
          onEventMove={handleEventMove}
          onEventResize={handleEventResize}
          onEventCreate={handleEventCreate}
          className="flex-1"
        />
      </DragDropProvider>
    </div>
  );
}
