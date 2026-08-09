import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  "aria-label"?: string;
}

function BackButton({ href, "aria-label": ariaLabel = "Back" }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="size-10" aria-label={ariaLabel}>
        <ArrowLeft />
      </Button>
    </Link>
  );
}

export { BackButton };
