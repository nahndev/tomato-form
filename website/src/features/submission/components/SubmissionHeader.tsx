import { BackButton } from "@/components/ui/back-button";
import SubmissionConnection from "@/features/submission/components/SubmissionConnection";
import { useCurrentTemplateVersion } from "@/features/submission/components/provider/TemplateVersionStateProvider";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { usePrincipalStore } from "@/store/principal.store";

const SubmissionHeader: React.FC = () => {
  const { name } = useTemplateState();
  const { version } = useCurrentTemplateVersion();
  const principal = usePrincipalStore((s) => s.principal);

  return (
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <BackButton />
      <div>
        <span>{name}</span>
      </div>
      <div className="flex-1" />
      <div className="ml-auto text-sm text-muted-foreground">
        v{version ?? "0.0.0"}
      </div>
      {principal && (
        <div className="ml-auto text-sm text-muted-foreground">
          Filling as {principal.name}
        </div>
      )}
      <SubmissionConnection />
    </div>
  );
};

export default SubmissionHeader;
