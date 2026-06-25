import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton: React.FC = () => {
  return (
    <Link href="/">
      <Button variant="ghost" size="icon" aria-label="Back to home">
        <ArrowLeft />
      </Button>
    </Link>
  );
};

export default BackButton;
