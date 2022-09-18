import Year from "../../../Statistic/Year";
import { useState, useEffect } from "react";
import { IoReloadCircleSharp } from "react-icons/io5";

import Loading from "../../../loading";

const index = ({ refresh, data, loading }) => {
  let curDate = new Date();
  let curYear = new Date().getFullYear();
  const baseYear = curYear - 1;

  const [fromYear, setFromYear] = useState(baseYear);
  const [toYear, setToYear] = useState(new Date().getFullYear() + 8);
  const [generatedYear, setGeneratedYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // const [yearChoice, setYearChoice] = useState(() => {
  //     let years = [];
  //     let to = curDate.getFullYear() + 10;
  //     for (var x = baseYear; x <= to; x++) years.push(x);
  //     return years;
  //   });

  useEffect(() => {
    let genYears = [];
    for (var x = baseYear; x <= toYear; x++) genYears.push(x);
    setGeneratedYear(genYears);
  }, [fromYear, toYear]);

  return (
    <div className="mt-4">
      <p className="text-lg mb-6">Calendar Detection</p>
      <div className="flex items-center justify-between">
        <p className="btn btn-sm mr-2 md:mr-2" onClick={() => refresh()}>
          <IoReloadCircleSharp
            className={`mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh{" "}
        </p>
        <div className="md:hidden dropdown dropdown-left">
          <label tabIndex="0" className="ml-2 btn btn-outline btn-sm">
            {selectedYear}
          </label>
          <ul
            tabIndex="0"
            className="dropdown-content menu max-h-60 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 rounded-sm"
          >
            {generatedYear.map((th, i) => (
              <li
                key={i}
                onClick={() => setSelectedYear(th)}
                className="cursor-pointer duration-100 m-1 snap-center"
              >
                <div className="flex p-1 justify-between">{th}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center">
          <div className="w-1/2">
            <Loading />
          </div>
        </div>
      )}
      <div className="md:flex my-4 max-h-80">
        <ul className="hidden md:block card max-h-80 overflow-y-scroll bg-base-100 shadow-xl">
          {generatedYear.map((yr, i) => (
            <li
              onClick={() => {
                setSelectedYear(yr);
              }}
              className={`my-2 ${
                curYear == yr ? "border-l-4 border-accent" : ""
              } duration-300 cursor-pointer hover:bg-base-200 px-6 py-2 w-full ${
                selectedYear === yr ? "bg-base-300" : ""
              }`}
              key={i}
            >
              {yr}
            </li>
          ))}
        </ul>
        <div className=" h-80 w-full overflow-y-scroll">
          {!loading && (
            <Year
              textColor={"#7d6d72"}
              hoverSeriesName={"Number of detections"}
              detections={data}
              yearChosen={selectedYear}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
