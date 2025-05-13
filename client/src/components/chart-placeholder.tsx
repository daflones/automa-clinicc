import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  FunnelProps,
  LabelList,
} from "recharts";

type ChartType = "bar" | "line" | "pie" | "funnel";

interface ChartPlaceholderProps {
  title: string;
  chartType: ChartType;
  periodOptions?: string[];
  defaultPeriod?: string;
  data: any[];
  height?: number;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

export function ChartPlaceholder({
  title,
  chartType,
  periodOptions = ["Esta Semana", "Este Mês", "Este Ano"],
  defaultPeriod = "Esta Semana",
  data,
  height = 300,
  onPeriodChange,
  className,
}: ChartPlaceholderProps) {
  const handlePeriodChange = (value: string) => {
    if (onPeriodChange) {
      onPeriodChange(value);
    }
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Bar dataKey="valor" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "funnel":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Funnel
                dataKey="valor"
                data={data}
                isAnimationActive
                >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`bg-card border-border ${className || ''}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        <div className="mt-2 sm:mt-0">
          <Select defaultValue={defaultPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] text-sm bg-muted text-gray-300 border border-gray-700">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
