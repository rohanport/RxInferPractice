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
  freeEnergyHistory: number[];
};

export const FreeEnergyChart = ({ freeEnergyHistory }: Props) => {
  const data = freeEnergyHistory.map((val, index) => [
    index + 1 - freeEnergyHistory.length,
    val,
  ]);
  const option = {
    title: { text: "Free Energy", textStyle: { color: "white" } },
    xAxis: {},
    yAxis: { min: 0 },
    series: [{ data, type: "line", smooth: true }],
  };

  return <StyledReactECharts option={option} />;
};
