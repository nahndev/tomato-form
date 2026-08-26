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
    <div>
      <div className="flex flex-wrap items-center gap-3 h-10">
        <h1 className="text-2xl font-bold">Templates</h1>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <DashboardCreator>
            <Button>
              <TomatoIcon icon={TomatoIconKey.Plus} className="mr-2 size-4" />
              New Template
            </Button>
          </DashboardCreator>
        </div>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        {total} template{total !== 1 ? "s" : ""} · {publishedCount} published ·{" "}
        {draftCount} draft
      </p>
    </div>
  );
};

export default DashboardHeader;
