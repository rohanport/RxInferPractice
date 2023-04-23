import {
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: Record<string, unknown>[];
  targetPosition: number;
};

export const ChillyBabyChart = ({ data, targetPosition }: Props) => {
  return (
    <ResponsiveContainer height={500} width={1000}>
      <ScatterChart>
        <XAxis
          dataKey="position"
          type="number"
          name="position"
          domain={[-200, 200]}
        />
        <YAxis dataKey="height" type="number" domain={[0, 40]} />
        <Scatter
          name="Baby"
          data={data}
          fill="#8884d8"
          isAnimationActive={false}
        />
        <ReferenceLine x={targetPosition} label="Target" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
