import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: string;
    positive: boolean;
  };
  changeText?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeText,
  iconBgColor = "bg-primary/20",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <Card className="bg-card border-border card-hover transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className={`rounded-full ${iconBgColor} p-3`}>
            <i className={`${icon} ${iconColor} text-xl`}></i>
          </div>
        </div>

        {change && (
          <div className="flex items-center mt-4">
            <span
              className={`text-sm flex items-center ${
                change.positive ? "text-green-500" : "text-red-500"
              }`}
            >
              <i
                className={`fas fa-arrow-${
                  change.positive ? "up" : "down"
                } mr-1 text-xs`}
              ></i>
              {change.value}
            </span>
            {changeText && (
              <span className="text-xs text-gray-400 ml-2">{changeText}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
