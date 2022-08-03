import { useState, useEffect } from "react";
import { dateToBeutify, dateYYYYMMDD, dateMwDDYYYY } from "../../../../helpers";
import { IoReloadCircleSharp } from "react-icons/io5";
import { SinglePick } from "../../../DatePick";
import Week from "../../../Statistic/Week";

import { InfoCustom } from "../../../modals";

import { FiChevronRight } from "react-icons/fi";
import { BsClipboardData } from "react-icons/bs";
import Loading from "../../../loading";

const index = ({ refresh, data, loading }) => {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(-1);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const [max, setMax] = useState(0);
  const [days, setDays] = useState([]);
  const [datas, setDatas] = useState([[0, 0, 1]]);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const hours = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];

  const filterData = (date) => {
    let dets = [];
    data.forEach((det) => {
      let d1 = dateYYYYMMDD(date, "-");
      let d2 = dateYYYYMMDD(new Date(det.cat), "-");
      if (d1 === d2) dets.push(det);
    });
    return dets;
  };

  const filterHours = (idx, dets, date) => {
    let dts = [];
    let HS = [
      12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11,
    ];

    for (var x = 0; x < 24; x++) {
      let count = 0;
      let detsId = [];

      dets.forEach((det) => {
        let detDate = new Date(det.cat);
        if (detDate.getHours() === x) {
          detsId.push(det);
          count++;
        }
      });
      if (count > max) setMax(count);
      var hour = HS[x];
      dts[x] = {
        date,
        hour: `${hour} ${x > 12 ? "pm" : "am"}`,
        dets: detsId,
        value: [x, idx, count === 0 ? "-" : count],
      };
    }

    return dts;
  };

  const updateDays = (date) => {
    let Days = [];
    let colData = [];

    for (var x = 0; x < 7; x++) {
      let nDate = new Date(date);
      nDate.setDate(nDate.getDate() + x);
      Days.unshift({
        date: nDate,
        value: weekday[nDate.getDay()],
      });
      let dtFl = filterData(nDate);
      let resArr = filterHours(6 - x, dtFl, nDate);
      colData = colData.concat(resArr);
    }
    setDatas(colData);
    setDays(Days);
  };

  useEffect(() => {
    updateDays(date);
  }, [date, data]);

  return (
    <div className="min-h-screen">
      <InfoCustom
        content={
          <div className="h-96 overflow-y-scroll mt-2">
            {selectedIds.map((det, i) => (
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
        title={`Detections on ${dateMwDDYYYY(
          selectedDateTime
        )} at ${selectedHour}`}
        onAcceptText={"close"}
        shown={showModal === 1}
        close={setShowModal}
      />
      <p className="text-lg mb-6">Week Detection</p>
      <div className="flex items-center justify-start">
        <p className="btn btn-sm mr-2 md:mr-2" onClick={() => refresh()}>
          <IoReloadCircleSharp
            className={`mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh{" "}
        </p>

        <SinglePick
          hideApply={true}
          onApply={() => {}}
          textDescription={"Choose A Day"}
          defaultDate={date}
          dateChanged={() => {}}
          setDate={(date) => {
            setDate(date);
          }}
        />
      </div>
      {loading && (
        <div className="flex justify-center">
          <div className="w-1/2">
            <Loading />
          </div>
        </div>
      )}
      <div className="w-full h-screen">
        {!loading && (
          <Week
            saveFileName={`WeekHeatMapChart ${dateMwDDYYYY(date)}`}
            textColor={"#7d6d72"}
            onEvents={{
              click: (e) => {
                setShowModal(1);
                setSelectedIds(e.data.dets);
                setSelectedHour(e.data.hour);
                setSelectedDateTime(e.data.date);
              },
            }}
            max={max}
            data={datas}
            days={days}
            hours={hours}
            title={"# Heat Stress during this hour"}
          />
        )}
      </div>
    </div>
  );
};

export default index;
