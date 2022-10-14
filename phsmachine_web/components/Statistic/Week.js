import { useState } from "react";
import { MorphChart } from "../charts";

const index = ({
  saveFileName,
  max,
  days,
  data,
  hours,
  title,
  onEvents,
  textColor,
}) => {
  return (
    <MorphChart
      onEvents={onEvents}
      option={{
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: !saveFileName ? "chart" : saveFileName,
              title: "Save",
              show: true,
            },
          },
        },
        tooltip: {
          position: "top",
        },
        grid: {
          height: "60%",
          top: "15%",
        },
        xAxis: {
          type: "category",
          data: hours,
          splitArea: {
            show: true,
          },
          axisLabel: {
            color: textColor,
            fontSize: 15,
          },
        },
        yAxis: {
          type: "category",
          data: days,
          splitArea: {
            show: true,
          },
          axisLabel: {
            color: textColor,
            fontSize: 15,
          },
        },
        visualMap: {
          min: 0,
          max: max,
          calculable: true,
          orient: "horizontal",
          left: "center",
          top: "5%",
          textStyle: {
            color: textColor,
          },
          inRange: {
            color: ["#ffd2ce", "#ff4b58"],
          },
        },
        series: [
          {
            name: title,
            type: "heatmap",
            data: data,
            animate: true,
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 40,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      }}
    />
  );
};

export default index;
