import Year from "../../../Statistic/Year";
import { useState, useEffect } from "react";
import { IoReloadCircleSharp } from "react-icons/io5";
import { dateYYYYMMDD } from "../../../../helpers";
import { dateMomentBeautify } from "../../../../helpers/dynamicHelper"
import MorphChart from "../../../charts/MorphChart";

import Loading from "../../../loading";

const index = ({ refresh, data, loading }) => {
  let curDate = new Date();
  let curYear = new Date().getFullYear();
  const baseYear = curYear - 1;

  const [fromYear, setFromYear] = useState(baseYear);
  const [toYear, setToYear] = useState(new Date().getFullYear() + 8);
  const [generatedYear, setGeneratedYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [finalData, setFinalData] = useState([["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]])

  // const [yearChoice, setYearChoice] = useState(() => {
  //     let years = [];
  //     let to = curDate.getFullYear() + 10;
  //     for (var x = baseYear; x <= to; x++) years.push(x);
  //     return years;
  //   });

  const findFromDatas = (datas, dateString) => {
    for (var x = 0; x < datas.length; x++) if (datas[x][0] === dateString) return x;
    return -1;
  };

  // Per Day 2022-06-05 // 4 detections { data.max_temp }
  // var AVG_TEMP = 38
  // ["2022-06-05", tempCounter / counter ] 

  const parseData = () => {
    let datas = [];
    // tempCounter = 38 + 38 + 39 + 40 /  4 = 
    // counter = 1 4 
    var startIndex = 0;

    data.sort((a, b) => {
      let A = new Date(a.cat), B = new Date(b.cat)
      return A.getTime() > B.getTime() ? -1 : 1;
    }).forEach((det, i) => {
      var focusDate = new Date(det.cat)

      // var counter = 0;
      var tempCounter = 0;

      for (var t = startIndex; t < data.length; t++) {
        var baseDate = dateYYYYMMDD(new Date(data[t].cat), '/')
        if (dateYYYYMMDD(focusDate, '/') !== baseDate) continue;
        tempCounter = tempCounter < data[t].data.max_temp ? data[t].data.max_temp : tempCounter
        // counter++
      }
      datas.push([dateYYYYMMDD(focusDate, '/'), tempCounter.toFixed(1)])
    });
    fillYears(datas)
  };

  const fillYears = (datas) => {
    let filled_datas = []
    const focDate = new Date(`1-1-${selectedYear}`)
    let max = 367

    while(focDate.getFullYear() !== selectedYear + 1){
        const stringified_date = dateYYYYMMDD(focDate, '/')
        focDate.setDate(focDate.getDate() + 1)
        let added = false
        for(var x = 0; x < datas.length && !added; x++){
            if(datas[x][0] === stringified_date){
                filled_datas.push(datas[x])
                added = !added
                break
            }          
        }
        if(added) continue
        filled_datas.push([stringified_date, '0.0'])
        max--;
        if(max <= 0) break;
    }

    setFinalData(filled_datas);
  }

  useEffect(() => {
    let genYears = [];
    for (var x = baseYear; x <= toYear; x++) genYears.push(x);
    setGeneratedYear(genYears);
    parseData()
  }, [fromYear, toYear]);

  useEffect(()=>{
    parseData()
  }, [data, selectedYear])

  return (
    <div className="mt-4">
      <p className="text-lg mb-6">Max Heat Graph</p>
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
              className={`my-2 ${curYear == yr ? "border-l-4 border-accent" : ""
                } duration-300 cursor-pointer hover:bg-base-200 px-6 py-2 w-full ${selectedYear === yr ? "bg-base-300" : ""
                }`}
              key={i}
            >
              {yr}
            </li>
          ))}
        </ul>
        <div className=" h-80 w-full overflow-y-scroll">
          {!loading && (
            <MorphChart
              option={
                {
                  toolbox: {
                    show: true,
                    feature: {
                      saveAsImage: {
                        name: `Max_Temperature_${selectedYear}`,
                        title: "Save",
                        show: true,
                      },
                    },
                  },
                  title: {
                    text: 'Yearly Maximum Thermal Graph',
                    textStyle: {
                      color: "#7d6d72"
                    },
                    left: 'center',
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                      params = params[0];
                      return (
                        `${dateMomentBeautify(new Date(params.data[0]), "MMM Do YYYY")} :
                        ${params.value[1] + ' °C'}`
                      );
                    },
                    axisPointer: {
                      animation: false
                    }
                  },
                  xAxis: {
                    type: 'time',
                    splitLine: {
                      show: false
                    },
                    axisLabel: {
                      textStyle: {
                        color: "#7d6d72"
                      },
                      formatter : (value, index) => dateMomentBeautify(new Date(value), "MMM Do YYYY")
                      
                    }
                    
                  },
                  yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                      show: false
                    },
                    axisLabel: {
                      textStyle: {
                        color: "#7d6d72"
                      }
                    }
                  },
                  dataZoom: [
                    {
                      type: 'inside',
                      start: 0,
                      end: 100
                    },
                    {
                      start: 0,
                      end: 100
                    }
                  ],
                  series: [
                    {
                      name: 'Max Temp',
                      type: 'line',
                      showSymbol: false,
                      areaStyle: {
                        color: 'rgb(255, 158, 68)'
                        
                      },
                      data: finalData
                    }
                  ]
                }
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
