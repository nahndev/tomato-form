import { Button } from "@/components/ui/button";
import { useTemplateMode } from "@/features/template/components/provider/TemplateBuilderProvider";
import {
  useTemplateId,
  useTemplateVersion,
} from "@/features/template/components/provider/TemplateProvider";
import { NavigationButton } from "@/components/ui/navigation-button";
import TemplateConnection from "@/features/template/components/template/TemplateConnection";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { TemplateMode } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";

export type TemplateHeaderProps = {};

const TemplateHeader: React.FC<TemplateHeaderProps> = () => {
  const id = useTemplateId();
  const { name } = useTemplateState();
  const mode = useTemplateMode();
  const version = useTemplateVersion();
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <NavigationButton href="/system/templates" />
      <div>
        <span>{name}</span>
      </div>
      <div className="flex-1" />
      <div className="ml-auto">v{version ?? "0.0.0"}</div>
      <div className="ml-auto">
        {mode === TemplateMode.VIEW ? (
          <Link href={`/templates/${id}?mode=edit`}>
            <Button size="sm">
              <TomatoIcon icon={TomatoIconKey.Pencil} className="mr-1.5 size-4" />
              Edit
            </Button>
          </Link>
        ) : (
          <Link href={`/templates/${id}?mode=view`}>
            <Button size="sm" variant="outline">
              Preview
            </Button>
          </Link>
        )}
      </div>
      <TemplateConnection />
    </div>
  );
};

export default TemplateHeader;
