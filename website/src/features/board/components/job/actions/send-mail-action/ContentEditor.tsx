"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailContent } from "@/types/job";

export type ContentEditorProps = {
  idPrefix: string;
  content: MailContent;
  onChange: (content: MailContent) => void;
  errors?: Partial<Record<keyof MailContent, string>>;
};

const ContentEditor: React.FC<ContentEditorProps> = ({
  idPrefix,
  content,
  onChange,
  errors,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-mail-subject`}>Subject</Label>
        <Input
          id={`${idPrefix}-mail-subject`}
          value={content.subject}
          onChange={(e) => onChange({ ...content, subject: e.target.value })}
          placeholder="e.g. Welcome to Tomato Form"
          error={errors?.subject}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-mail-body`}>Body</Label>
        <Textarea
          id={`${idPrefix}-mail-body`}
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          placeholder="Write the email content…"
          error={errors?.body}
        />
      </div>
    </div>
  );
};

export default ContentEditor;
