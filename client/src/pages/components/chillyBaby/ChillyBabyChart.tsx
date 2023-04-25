import React from "react";
import styled from "styled-components";
import ReactECharts from "echarts-for-react";

const StyledReactECharts = styled(ReactECharts)`
  flex-grow: 1;
  display: flex;
  height: 100%;
  width: 100%;
`;

type Props = {
  location: number;
  targetPosition: number;
};
const xMax = 200;
const yMax = 40;

export const ChillyBabyChart = ({ location, targetPosition }: Props) => {
  const targetLine = {
    animation: false,
    label: {
      formatter: "target",
      align: "right",
    },
    lineStyle: {
      type: "solid",
    },
    tooltip: {
      formatter: "target",
    },
    data: [
      [
        {
          coord: [targetPosition, 0],
          symbol: "none",
        },
        {
          coord: [targetPosition, yMax],
          symbol: "none",
        },
      ],
    ],
  };

  const option = {
    xAxis: { min: 0, max: xMax },
    yAxis: { min: 0, max: yMax },
    series: [
      {
        symbolSize: 20,
        data: [[location, yMax / 2]],
        type: "scatter",
        markLine: targetLine,
      },
    ],
  };

  return <StyledReactECharts option={option} />;
};
