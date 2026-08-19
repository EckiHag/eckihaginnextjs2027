"use client";

import { CalendarCheck } from "lucide-react";

type ScrollToTodayButtonProps = {
  todayId: string;
};

export default function ScrollToTodayButton({ todayId }: ScrollToTodayButtonProps) {
  function handleClick() {
    const element = document.getElementById(todayId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <button type="button" onClick={handleClick} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/10" title="Zum heutigen Datum">
      <CalendarCheck className="h-5 w-5" />
    </button>
  );
}
