"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useRouter } from "next/navigation";

interface DashboardRowMenuProps {
  templateId: string;
  isDeleting: boolean;
  onDelete: () => void;
}

const DashboardRowMenu: React.FC<DashboardRowMenuProps> = ({
  templateId,
  isDeleting,
  onDelete,
}) => {
  const router = useRouter();

  return (
    <>
      <DropdownMenuItem
        onSelect={() => router.push(`/templates/${templateId}`)}
      >
        <TomatoIcon icon={TomatoIconKey.Document} />
        Open
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        disabled={isDeleting}
        onSelect={onDelete}
      >
        <TomatoIcon icon={TomatoIconKey.Trash} />
        Delete
      </DropdownMenuItem>
    </>
  );
};

export default DashboardRowMenu;
