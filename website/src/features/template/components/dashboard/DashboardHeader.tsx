import { Button } from "@/components/ui/button";
import DashboardCreator from "@/features/template/components/dashboard/DashboardCreator";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

interface DashboardHeaderProps {
  total: number;
  publishedCount: number;
  draftCount: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  total,
  publishedCount,
  draftCount,
}) => {
  return (
    <div className="border border-transparent px-2">
      <div className="flex flex-wrap items-center gap-2 h-10">
        {/* Matches ListTable's checkbox column width so the title aligns with row content, not the checkbox */}
        <div className="h-10 w-10 shrink-0" />

        <h1 className="text-2xl font-bold">Templates</h1>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <DashboardCreator>
            <Button>
              <TomatoIcon icon={TomatoIconKey.Plus} className="mr-2 size-4" />
              New Template
            </Button>
          </DashboardCreator>

          {/* Matches ListTable's row-menu column width so the button aligns with row content */}
          <div className="h-10 w-10 shrink-0" />
        </div>
      </div>

      <p className="mt-1 pl-12 text-sm text-muted-foreground">
        {total} template{total !== 1 ? "s" : ""} · {publishedCount} published ·{" "}
        {draftCount} draft
      </p>
    </div>
  );
};

export default DashboardHeader;
