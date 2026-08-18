import SubmissionSessionCanvas from "@/features/submission/components/session/SubmissionSessionCanvas";
import SubmissionSessionHeader from "@/features/submission/components/session/SubmissionSessionHeader";
import { SessionProvider } from "@/features/template/components/session/SessionProvider";

export interface SubmissionSessionBoxProps {
  sessionId: string;
}

const SubmissionSessionBox: React.FC<SubmissionSessionBoxProps> = ({
  sessionId,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-md rounded-md p-4">
        <SessionProvider sessionId={sessionId}>
          <SubmissionSessionHeader />
          <SubmissionSessionCanvas />
        </SessionProvider>
      </div>
    </div>
  );
};

export default SubmissionSessionBox;
