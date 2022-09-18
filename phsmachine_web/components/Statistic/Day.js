import { useState } from "react";
import { MorphChart } from "../charts";

const index = () => {
  const [data, setData] = useState([
    ["2016-01-06", 14],
    ["2016-01-04", 5],
  ]);

  return (
    <div>
      Stats
      <div>
        {/** SIMPLE STATS */}
        <div className="py-10 mb-32 ">
          <MorphChart
            option={{
              toolbox: {
                show: true,
                feature: {
                  saveAsImage: { title: "Save", show: true },
                },
              },
              title: {
                top: 0,
                left: "center",
                text: "Heat Stress Detection",
                subtextStyle: {
                  fontSize: 20,
                },
                textStyle: {
                  color: "#ff5a66",
                  fontSize: 30,
                },
              },
              tooltip: {},
              visualMap: {
                min: 0,
                max: 100,
                type: "piecewise",
                calculable: true,
                orient: "horizontal",
                left: "center",
                itemWidth: 30,
                top: 50,
                inRange: {
                  color: ["#ffd2ce", "#ff4b58"],
                },
              },
              calendar: {
                top: 120,
                right: 30,
                cellSize: ["auto", 20],
                range: "2016",
                itemStyle: {
                  borderWidth: 0.1,
                  borderRadius: 10,
                  borderColor: "none",
                  color: "rgba(255,255,255,0)",
                },
                yearLabel: { show: true },
              },
              series: {
                type: "heatmap",
                coordinateSystem: "calendar",
                data: data,
                itemStyle: {
                  // borderRadius: 10,
                  borderRadius: [5, 5, 5, 5],
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default index;
