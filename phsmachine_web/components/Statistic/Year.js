import { useState, useEffect } from "react";
import { dateYYYYMMDD } from "../../helpers";
import HeatmapCalendar from "../charts/HeatmapCalendar";

const index = ({ detections, yearChosen }) => {
  const [data, setData] = useState([
    ["2022-01-06", 14],
    ["2022-01-04", 5],
  ]);

  const findFromDatas = (datas, dateString) => {
    for(var x = 0; x < datas.length; x++){
        if(datas[x][0] === dateString) return x
    }
    return -1
}

  const parseData = () => {
    let datas = [];
    detections.forEach((det) => {
        let date = det.cat ? new Date(det.cat) : new Date()
        let dString = dateYYYYMMDD(date, '-')
        let idx = findFromDatas(datas, dString)
        if(idx === -1)  datas.push([dString, 1])
        else datas[idx][1] += 1
    })

    setData(datas)
  }

  useEffect(() => { parseData() }, [yearChosen, detections]);


  return (
    <div className=" md:mx-8 lg:mx-16 ">
      <div>
        {/** SIMPLE STATS */}
        <div className="py-5 ">
          <HeatmapCalendar
            option={{
              toolbox: {
                show: true,
                feature: {
                  saveAsImage: { title: "Save", show: true },
                },
              },
              //   title: {
              //     top: 0,
              //     left: "center",
              //     text: "Heat Stress Detection",
              //     subtextStyle: {
              //       fontSize: 15,
              //     },
              //     textStyle: {
              //       color: "#ff5a66",
              //       fontSize: 20,
              //     },
              //   },
              tooltip: {},
              visualMap: {
                min: 0,
                max: 50,
                type: "piecewise",
                calculable: true,
                orient: "horizontal",
                left: "center",
                itemWidth: 30,
                precision : 0,
                top: 20,
                // pieces: [
                //   { min: 1, max: 10 },
                //   { min: 11, max: 20 },
                //   { min: 31, max: 40 },
                //   { min: 51, max: 60 },
                //   { min: 71, max: 80 },
                //   { min: 81, max: 90 },
                //   { min: 91, max: 100 }
                // ],
                textStyle: {
                  color: "#7d6d72",
                },
                inRange: {
                  color: ["#ffd2ce", "#ff4b58"],
                },
              },
              calendar: {
                top: 100,
                right: 30,
                cellSize: ["auto", 20],
                range: yearChosen,
                itemStyle: {
                  borderWidth: 0.1,
                  borderRadius: 10,
                  borderColor: "none",
                  color: "rgba(255,255,255,0)",
                },
                yearLabel: {
                  show: true,
                  color: "#7d6d72",
                  fontSize: 30,
                },
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
