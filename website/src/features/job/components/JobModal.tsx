"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export type JobModalProps = {
  children: React.ReactNode;
};

const JobModal: React.FC<JobModalProps> = ({ children }) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="max-h-[85vh] bg-red-500 overflow-y-auto">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;
