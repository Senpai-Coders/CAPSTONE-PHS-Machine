import { useState, useEffect } from "react";
import { dayNames } from "../../../../helpers"
import { IoReloadCircleSharp } from "react-icons/io5";
import { SinglePick } from "../../../DatePick";

const index = ({ refresh, data }) => {
  const baseYear = 2022;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
 
  const [days, setDays] = useState([])

  const updateDays = (date) => {
    let DS = []
    let Dates = []

    for(var x = 0; x < 7; x++){
        let nDate = new Date()
        nDate.setDate(date.getDate()+1)
        console.log(nDate.toDateString)
    }
  }

  useEffect(() => {

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

      <div className="flex items-center justify-start"></div>
    </div>
  );
};

export default index;
