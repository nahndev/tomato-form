"use client";

import { Button } from "@/components/ui/button";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  "aria-label"?: string;
}

function BackButton({ "aria-label": ariaLabel = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="size-10"
      aria-label={ariaLabel}
      onClick={() => router.back()}
    >
      <TomatoIcon icon={TomatoIconKey.ArrowLeft} />
    </Button>
  );
}

export { BackButton };
