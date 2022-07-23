import { useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";

import { dateOnlyToWord } from "../helpers";

const TIME_STRIP = () => {
  const [hr, setHr] = useState(0);
  const [min, setMin] = useState(0);
  const [AMPM, setAMPM] = useState("AM");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    let intrvl = setInterval(() => {
      let cur_d = new Date();
      var month = cur_d.toLocaleString("default", { month: "long" });
      var day = cur_d.getUTCDate();
      setDateStr(`${month} ${day}`);
      let M = cur_d.getMinutes();
      let hours = cur_d.getHours();
      let H = hours % 12 || 12;
      let ampm = hours >= 12 ? "PM" : "AM";
      setHr(H);
      setMin(M);
      setAMPM(ampm);
    }, 1000);

    return () => clearInterval(intrvl);
  }, []);

  return (
    <div className="flex text-sm justify-evenly items-center mr-4 font-mono">
      {/* <p className='mr-2'>{dateStr+", "}</p> */}
      {/* <BsClockHistory className='ml-2 w-4 h-4 mr-2' /> */}
      <span className="countdown mr-2">
        <span style={{ "--value": `${hr}` }}></span>:
        <span style={{ "--value": `${min}` }}></span>
      </span>
      <span> {AMPM}</span>
    </div>
  );
};

export default TIME_STRIP;
