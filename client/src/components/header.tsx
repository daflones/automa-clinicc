import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionIcon?: string;
  onActionClick?: () => void;
}

export function Header({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onActionClick,
}: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">{title}</h1>
        <p className="text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Pesquisar..."
            className="bg-muted text-gray-300 pl-10 pr-4 py-2 border border-gray-700 focus:border-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>
        {actionLabel && (
          <Button
            onClick={onActionClick}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
          >
            {actionIcon && <i className={`${actionIcon} mr-2`}></i>}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
