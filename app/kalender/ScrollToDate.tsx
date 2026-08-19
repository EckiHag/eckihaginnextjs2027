"use client";

import { useEffect } from "react";

type ScrollToDateProps = {
  dateId: string;
};

export default function ScrollToDate({ dateId }: ScrollToDateProps) {
  useEffect(() => {
    const element = document.getElementById(dateId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [dateId]);

  return null;
}
