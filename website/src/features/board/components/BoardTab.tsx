import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Discussion from "@/features/board/components/Discussion";
import History from "@/features/board/components/History";
import Setting from "@/features/board/components/Setting";
import { BoardTabValue } from "@/types/board";

const BoardTab: React.FC = () => {
  return (
    <Tabs defaultValue={BoardTabValue.SETTING} className="px-4 py-4">
      <TabsList className="w-full">
        <TabsTrigger value={BoardTabValue.SETTING}>Setting</TabsTrigger>
        <TabsTrigger value={BoardTabValue.HISTORY}>History</TabsTrigger>
        <TabsTrigger value={BoardTabValue.DISCUSSION}>Discussion</TabsTrigger>
      </TabsList>

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
