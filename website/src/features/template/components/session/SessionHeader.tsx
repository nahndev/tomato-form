"use client";

import { IconPicker } from "@/components/ui/icon-picker";
import { SessionNameInput } from "@/features/template/components/session/SessionNameInput";
import { useSessionId } from "@/features/template/components/session/SessionProvider";
import SessionSettingPopup from "@/features/template/components/session/SessionSettingPopup";
import { useSessionActions } from "@/features/template/sync/hooks/useSessionActions";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";

const SessionHeader: React.FC = () => {
  const sessionId = useSessionId();
  const { session } = useSessionState();
  const { updateSession } = useSessionActions();

  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 p-2">
      <div className="relative flex items-center gap-2">
        <IconPicker
          value={session?.icon}
          onChange={(icon) => updateSession(sessionId, { icon })}
          className="absolute right-full size-10 mr-8"
        />
        <SessionNameInput />
        <SessionSettingPopup />
      </div>
      {/* <SessionDescriptionInput /> */}
    </div>
  );
};

export default SessionHeader;
