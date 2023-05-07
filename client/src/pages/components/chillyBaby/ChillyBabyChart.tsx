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
  position: number;
  targetPosition: number;
  predictedPositions: number[];
};
const xMin = -200;
const xMax = 200;
const yMin = 0;
const yMax = 40;

export const ChillyBabyChart = ({
  position,
  targetPosition,
  predictedPositions = [],
}: Props) => {
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
    title: { text: "Agent", textStyle: { color: "white" } },
    xAxis: { min: xMin, max: xMax },
    yAxis: { min: yMin, max: yMax },
    series: [
      {
        symbolSize: 20,
        data: [[position, (yMax - yMin) / 2]],
        type: "scatter",
        markLine: targetLine,
      },
      ...predictedPositions.map((val, index) => ({
        type: "scatter",
        symbolSize: 15,
        data: [[val, (yMax - yMin) / 2]],
        color: `rgb(124, 252, 0, ${0.9 - index / 10})`,
      })),
    ],
  };

  return <StyledReactECharts option={option} />;
};
