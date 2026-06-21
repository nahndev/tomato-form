import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BackButton: React.FC = () => {
  return (
    <Link href="/boards">
      <Button variant="ghost" className="size-10">
        <ArrowLeft />
      </Button>
    </Link>
  );
};

export default BackButton;
