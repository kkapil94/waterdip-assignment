import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: Array<{ value: number }>;
  color?: string;
}

export const SparklineChart = ({
  data = Array.from({ length: 20 }, (_) => ({ value: Math.random() * 100 })),
  color = "#8884d8",
}: SparklineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
