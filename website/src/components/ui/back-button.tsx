import { Button } from "@/components/ui/button";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  "aria-label"?: string;
}

function BackButton({ href, "aria-label": ariaLabel = "Back" }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="size-10" aria-label={ariaLabel}>
        <TomatoIcon icon={TomatoIconKey.ArrowLeft} />
      </Button>
    </Link>
  );
}

export { BackButton };
