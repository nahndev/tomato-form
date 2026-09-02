import type { Template } from "@/types/template";
import AddTemplateButton from "./AddTemplateButton";
import TemplateBadge from "./TemplateBadge";

export type BoardTemplatePart =
  | { kind: "badge"; name: string }
  | {
      kind: "creation";
      availableTemplates: Template[];
      isLoading: boolean;
      onAdd: (templateId: string) => void;
    };

export interface BoardTemplateProps {
  part: BoardTemplatePart;
}

/** Renders either a linked template's name badge or the add-template control, depending on `part`. */
const BoardTemplate: React.FC<BoardTemplateProps> = ({ part }) => {
  switch (part.kind) {
    case "badge":
      return <TemplateBadge name={part.name} />;
    case "creation":
      return (
        <AddTemplateButton
          availableTemplates={part.availableTemplates}
          isLoading={part.isLoading}
          onAdd={part.onAdd}
        />
      );
  }
};

export default BoardTemplate;
