import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Discussion from "@/features/board/components/Discussion";
import History from "@/features/board/components/History";
import JobList from "@/features/board/components/job/JobList";
import Setting from "@/features/board/components/Setting";
import SubmissionList from "@/features/board/components/submission/SubmissionList";
import TemplateSetting from "@/features/board/components/TemplateSetting";
import { BoardTabValue } from "@/types/board";

const BoardTab: React.FC = () => {
  return (
    <Tabs defaultValue={BoardTabValue.SUBMISSIONS} className="px-4 py-4">
      <TabsList className="w-full">
        <TabsTrigger value={BoardTabValue.SUBMISSIONS}>
          Submission List
        </TabsTrigger>
        <TabsTrigger value={BoardTabValue.TEMPLATE}>Template</TabsTrigger>
        <TabsTrigger value={BoardTabValue.JOBS}>Jobs</TabsTrigger>
        <TabsTrigger value={BoardTabValue.SETTING}>Setting</TabsTrigger>
        <TabsTrigger value={BoardTabValue.HISTORY}>History</TabsTrigger>
        <TabsTrigger value={BoardTabValue.DISCUSSION}>Discussion</TabsTrigger>
      </TabsList>

      <TabsContent value={BoardTabValue.TEMPLATE}>
        <TemplateSetting />
      </TabsContent>
      <TabsContent value={BoardTabValue.SUBMISSIONS}>
        <SubmissionList />
      </TabsContent>
      <TabsContent value={BoardTabValue.JOBS}>
        <JobList />
      </TabsContent>
      <TabsContent value={BoardTabValue.SETTING}>
        <Setting />
      </TabsContent>
      <TabsContent value={BoardTabValue.HISTORY}>
        <History />
      </TabsContent>
      <TabsContent value={BoardTabValue.DISCUSSION}>
        <Discussion />
      </TabsContent>
    </Tabs>
  );
};

export default BoardTab;
