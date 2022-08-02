import Year from "../../../Statistic/Year";
import { useState, useEffect } from "react";
import { IoReloadCircleSharp } from "react-icons/io5";

const index = ({ refresh, data, loading }) => {
  const baseYear = 2022;
  let curDate = new Date();
  
  const [fromYear, setFromYear] = useState(baseYear);
  const [toYear, setToYear] = useState( new Date().getFullYear() + 8);
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
      <div className="flex items-center justify-start">
        <p className="btn btn-sm mr-2 md:mr-2" onClick={() => refresh()}>
          <IoReloadCircleSharp
            className={`mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh{" "}
        </p>
        <div className="md:hidden dropdown">
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
        {/* <p>Start Year</p>
        <div className="dropdown">
          <label tabIndex="0" className="ml-2 btn btn-outline btn-sm">
            {fromYear}
          </label>
          <ul
            tabIndex="0"
            className="dropdown-content menu max-h-80 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 rounded-sm"
          >
            {yearChoice.map((th, i) => (
              <li
                key={i}
                onClick={() => {
                  if (toYear <= th) setToYear(th + 1);
                  setFromYear(th);
                }}
                className="cursor-pointer duration-100 m-1 snap-center"
              >
                <div className="flex p-1 justify-between">{th}</div>
              </li>
            ))}
          </ul>
        </div> 

        <p className="ml-6">End Year</p>
        <div className="dropdown">
          <label tabIndex="0" className="ml-2 btn btn-outline btn-sm">
            {toYear}
          </label>
          <ul
            tabIndex="0"
            className="dropdown-content menu max-h-80 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 rounded-sm"
          >
            {yearChoice
              .filter((yr) => {
                return yr > fromYear;
              })
              .map((th, i) => (
                <li
                  key={i}
                  onClick={() => setToYear(th)}
                  className="cursor-pointer duration-100 m-1 snap-center"
                >
                  <div className="flex p-1 justify-between">{th}</div>
                </li>
              ))}
          </ul>
        </div>
    */}
      </div>

      <div className="md:flex my-4 max-h-80">
        <ul className="hidden md:block card max-h-80 overflow-y-scroll bg-base-100 shadow-xl">
          {generatedYear.map((yr, i) => (
            <li
              onClick={() => {
                setSelectedYear(yr);
              }}
              className="my-2 cursor-pointer hover:bg-base-200 px-6 py-2 w-full"
              key={i}
            >
              {yr}
            </li>
          ))}
        </ul>
        <div className=" h-80 w-full overflow-y-scroll">
          {/* {generatedYear.map((year, idx) => (
            //   <p key={idx}>{year}</p>
            <Year yearChosen={year} key={idx} />
          ))} */}
          {<Year hoverSeriesName={'Number of detections'} detections={data} yearChosen={selectedYear} />}
        </div>
      </div>
    </div>
  );
};

export default index;
