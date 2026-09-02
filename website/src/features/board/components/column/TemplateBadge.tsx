export interface TemplateBadgeProps {
  name: string;
}

const TemplateBadge: React.FC<TemplateBadgeProps> = ({ name }) => {
  return <span className="text-sm">{name}</span>;
};

export default TemplateBadge;
