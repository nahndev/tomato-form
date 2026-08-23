import { Button } from "@/components/ui/button";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";

interface NavigationButtonProps {
  href: string;
  "aria-label"?: string;
}

function NavigationButton({
  href,
  "aria-label": ariaLabel = "Back",
}: NavigationButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="size-10" aria-label={ariaLabel}>
        <TomatoIcon icon={TomatoIconKey.ArrowLeft} />
      </Button>
    </Link>
  );
}

export { NavigationButton };
