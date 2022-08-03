import { useState } from "react";
import { MorphChart } from "../charts"

const index = ({max, days, data, hours, title }) => {
  return (
          <MorphChart
            option={{
                toolbox: {
                    show: true,
                    feature: {
                      saveAsImage: { title: "Save", show: true },
                    },
                  },
                tooltip: {
                  position: 'top'
                },
                grid: {
                  height: '60%',
                  top: '15%'
                },
                xAxis: {
                  type: 'category',
                  data: hours,
                  splitArea: {
                    show: true
                  }
                },
                yAxis: {
                  type: 'category',
                  data: days,
                  splitArea: {
                    show: true
                  }
                },
                visualMap: {
                  min: 0,
                  max: max,
                  calculable: true,
                  orient: 'horizontal',
                  left: 'center',
                  top: '5%',
                  textStyle: {
                    color: "#7d6d72",
                  },
                  inRange: {
                    color: ["#ffd2ce", "#ff4b58"],
                  },
                },
                series: [
                  {
                    name: title,
                    type: 'heatmap',
                    data: data,
                    animate : true,
                    label: {
                      show: true
                    },
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }}
          />
  );
};

export default index;
