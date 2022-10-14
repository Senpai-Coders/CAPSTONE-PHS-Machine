import { useState, useEffect } from "react";
import { dateYYYYMMDD, dateToBeutify } from "../../helpers";
import HeatmapCalendar from "../charts/HeatmapCalendar";
import { InfoCustom } from "../modals/";

import { FiChevronRight } from "react-icons/fi";
import { BsClipboardData } from "react-icons/bs";

const index = ({
  saveFileName,
  detections,
  yearChosen,
  hoverSeriesName,
  textColor,
}) => {
  const [dateSelected, setDateSelected] = useState(
    dateYYYYMMDD(new Date(), "-")
  );
  const [showModal, setShowModal] = useState(-1);

  const [data, setData] = useState([
    ["2022-01-06", 14],
    ["2022-01-04", 5],
  ]);

  const findFromDatas = (datas, dateString) => {
    for (var x = 0; x < datas.length; x++) {
      if (datas[x][0] === dateString) return x;
    }
    return -1;
  };

  const parseData = () => {
    let datas = [];
    detections.forEach((det) => {
      let date = det.cat ? new Date(det.cat) : new Date();
      let dString = dateYYYYMMDD(date, "-");
      let idx = findFromDatas(datas, dString);
      if (idx === -1) datas.push([dString, 1]);
      else datas[idx][1] += 1;

      // if(idx === -1)  datas.push({ name : dString, value : 1 })
      // else datas[idx].value += 1
    });

    setData(datas);
  };

  const getSpecificDetection = (date) => {
    let dets = [];

    detections.forEach((detection, i) => {
      const dt = dateYYYYMMDD(new Date(detection.cat), "-");
      if (dt === dateSelected) dets.push(detection);
    });

    return dets;
  };

  useEffect(() => {
    parseData();
  }, [yearChosen, detections]);

  return (
    <div className=" md:mx-8 lg:mx-16 ">
      {/** MODAL */}
      <InfoCustom
        content={
          <div className="h-96 overflow-y-scroll mt-2">
            {getSpecificDetection(dateSelected).map((det, i) => (
              <div className="flex hover:bg-base-200 px-2 rounded-md py-4 items-center justify-between border-b border-accent/20">
                <div className="flex items-center justify-start">
                  <BsClipboardData className="w-6 h-6 text-secondary mr-2" />
                  <div>
                    <p>{dateToBeutify(new Date(det.cat), "-")}</p>
                  </div>
                </div>
                <a
                  target="blank"
                  className="flex items-center hover:text-primary"
                  href={`/detection_details?_id=${det._id}`}
                >
                  View
                  <FiChevronRight className="h-5 w-5" />
                </a>
                {/* <div onClick={()=>router.push(`/detection_details?_id=${det._id}`)} className="cursor-pointer hover:text-primary flex items-center">
                  View
                  <FiChevronRight className="h-5 w-5" />
                </div> */}
              </div>
            ))}
          </div>
        }
        title={`Detections on ${dateSelected}`}
        onAcceptText={"close"}
        shown={showModal === 1}
        close={setShowModal}
      />

      <div>
        {/** SIMPLE STATS */}
        <div className="py-5 ">
          <HeatmapCalendar
            onEvents={{
              click: (e) => {
                setShowModal(1);
                setDateSelected(e.value[0]);
              },
            }}
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
                precision: 0,
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
                  color: textColor,
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
                  color: "rgba(255,255,255,0.1)",
                },
                yearLabel: {
                  show: true,
                  color: textColor,
                  fontSize: 30,
                },
                monthLabel: {
                  show: true,
                  color: textColor,
                  fontSize: 15,
                },
                dayLabel: {
                  show: true,
                  color: textColor,
                  fontSize: 15,
                },
              },
              series: {
                name: hoverSeriesName,
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
