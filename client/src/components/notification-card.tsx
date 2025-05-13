import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  actionLabel: string;
  onActionClick?: () => void;
}

export function NotificationCard({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  time,
  actionLabel,
  onActionClick,
}: NotificationCardProps) {
  return (
    <Card className="flex items-start p-3 bg-background border border-border transition-all hover:border-gray-700">
      <div className={`rounded-full ${iconBgColor} p-2 mr-3`}>
        <i className={`${icon} ${iconColor}`}></i>
      </div>
      <div className="flex-1">
        <p className="text-sm text-white font-medium">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">{time}</span>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-primary hover:underline p-0 h-auto"
            onClick={onActionClick}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
