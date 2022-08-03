import { useState, useEffect } from "react";
import { dayNames, dateYYYYMMDD } from "../../../../helpers"
import { IoReloadCircleSharp } from "react-icons/io5";
import { SinglePick } from "../../../DatePick";
import Week from "../../../Statistic/Week"

const index = ({ refresh, data }) => {
  const baseYear = 2022;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
 
  const [max, setMax] = useState(0)
  const [days, setDays] = useState([])
  const [datas, setDatas] = useState([[0,0,1]])

  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const hours = [
    '12am', '1am', '2am', '3am', '4am', '5am', '6am',
    '7am', '8am', '9am', '10am', '11am',
    '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
    '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
  ];

  const filterData = (date) => {
    let dets = []
    data.forEach((det)=>{
        let d1 = dateYYYYMMDD(date, '-')
        let d2 = dateYYYYMMDD(new Date(det.cat), '-')
        if(d1 === d2) dets.push(det)
    })
    return dets
  }

  const filterHours = (idx, dets) => {
    let dts = [] // [[ day, col, val ]]

    for(var x = 0; x < 24; x++){
        let count = 0;

        dets.forEach((det)=>{
            let detDate = new Date(det.cat)
            console.log(detDate.getHours(), x, detDate.getHours() === x)
            if(detDate.getHours() === x) count++
        })

        dts[x] = [x, idx, count === 0 ? '-' : count]
    }
    
    return dts
  }

  const updateDays = (date) => {
    let Days = []
    let colData = []

    for(var x = 0; x < 7; x++){
        let nDate = new Date(date)
        nDate.setDate(nDate.getDate()+x)
        Days.unshift({
            date : nDate,
            value :  weekday[nDate.getDay()]
        })
        let dtFl = filterData(nDate)
        let resArr = filterHours(6-x, dtFl)
        colData = colData.concat(resArr)
    }

    // for(var x = 0; x < 7; x++){
    //     var tmp = Days[6 - x]
    //     Days[6 - x] = Days[x]
    //     Days[x] = tmp
    // }
    setDatas(colData)
    setDays(Days)
  }

  useEffect(() => {
    updateDays(date);
  }, [date])

  return (
    <div className="mt-8 min-h-screen">
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
              dateChanged={()=>{}}
              setDate={(date) => { setDate(date) }}
            />
      </div>

      <div className="w-full h-screen">
        <Week max={max} data={datas} days={days} hours={hours} title={'# Heat Stress during this hour'}/>
      </div>
    </div>
  );
};

export default index;
