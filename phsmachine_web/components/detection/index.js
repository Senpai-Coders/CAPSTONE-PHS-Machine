import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { IoReloadCircleSharp, IoTrashBinSharp } from "react-icons/io5";
import { GoPrimitiveDot } from "react-icons/go"
import { BiExport } from "react-icons/bi"

import { dateToWord } from "../../helpers";
import { DeleteConfirm, InfoCustom, ExportConfirm } from "../modals";
import { RangePick, SinglePick } from "../DatePick";


const index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState([]);
  const [copDet, setCopDet] = useState([]) //copy of detections state

  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(-1);

  const [dateMode, setDateMode] = useState(0);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [dateChanged, setDateChange] = useState(false);

  const filterDateRange = (from, to, date) => {
    let FROM = new Date(from)
    FROM.setDate(FROM.getDate());
    let TO = new Date(to)
    TO.setDate(TO.getDate() + 1);
    return date >= FROM && date <= TO;
  };

  const filterDateEqual = (to, date) => { return to.toDateString() === date.toDateString(); };

  const filterData = (data) => {
    let filtered = [];
    if (dateMode === 0) return data;
    if (dateMode === 1) {
      data.forEach((det) => {
        let focObj = { ...det };
        if (!det.cat) focObj = { ...det, cat: new Date() };
        if (filterDateEqual(fromDate, new Date(focObj.cat)))
          filtered.push(focObj);
      });

      return filtered;
    }
    if (dateMode === 2) {
      data.forEach((det) => {
        let focObj = { ...det };
        if (!det.cat) focObj = { ...det, cat: new Date() };
        if (filterDateRange(fromDate, toDate, new Date(focObj.cat)))
          filtered.push(focObj);
      });
      return filtered;
    }
  };

  const init = async (t) => {
    try {
      setLoading(true);
      const resp = await axios.post("/api/phs/detection", { mode: 0 });
      let det = resp.data.detection_data
      setDetections(filterData(det));
      setCopDet(det)
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getObjIndex = (id) => {
    return detections.findIndex((obj) => {
      return obj._id === id;
    });
  };

  const deleteSelected = async () => {
    try {
      let ids = [];

      selected.forEach((id) => {
        let foundIdx = getObjIndex(id);
        if (foundIdx > -1) {
          var focPath = detections[foundIdx].img_normal;
          var fslash = focPath.indexOf("/", 1);
          var sslash = focPath.indexOf("/", fslash + 1);
          var delFold = focPath.substring(fslash + 1, sslash);
          ids.push({ id, path: delFold });
        }
      });

      const resp = await axios.post("/api/phs/detection", {
        mode: -2,
        ids,
      });
      setSelected([]);
      init();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="relative mt-8">
      {loading && (
        <div className="right-0 top-0 w-1/12 flex absolute items-center space-x-4">
          <progress className="progress"></progress>
        </div>
      )}

      <DeleteConfirm
        shown={modal === 1}
        close={setModal}
        onAccept={deleteSelected}
      />

      <ExportConfirm
        shown={modal === 3}
        close={()=>setModal(-1)}
        onAccept={()=>{}}
      />

      <InfoCustom
        shown={modal === 2}
        close={setModal}
        title={"Invalid Date"}
        content={<div>
            <p className="mt-2">Please follow this rule</p>
            <ul className="my-2">
                <li className="flex items-center"><GoPrimitiveDot className="mr-2"/>Start Date must always greater than End Date</li>
                <li className="flex items-center"><GoPrimitiveDot className="mr-2"/>End Date must always less than Start Date</li>
            </ul>
        </div>}
        onAcceptText={"ok"}
      />

      {/** MENU */}
      <div className="px-4 ">
        <div className="flex md:space-x-2 items-center flex-wrap justify-start">
          <p className="btn btn-sm mr-2 md:mr-0" onClick={() => init()}>
            <IoReloadCircleSharp
              className={`mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh{" "}
          </p>

          <div className="dropdown mr-2 md:mr-0 dropdown-hover">
            <label tabIndex="0" className="btn btn-sm">
              {dateMode === 0 && "All"}
              {dateMode === 1 && "Single Date"}
              {dateMode === 2 && "Range Date"}
            </label>
            <ul
              tabIndex="0"
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a
                  onClick={() => {
                    setDateMode(0);
                    setDetections(copDet)
                    init()
                  }}
                >
                  All Date
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setDateMode(1);
                  }}
                >
                  Single Date
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setDateMode(2);
                  }}
                >
                  Range Date
                </a>
              </li>
            </ul>
          </div>

          {dateMode === 1 && (
            <SinglePick
              onApply={() => {
                setDateChange(false);
                init();
              }}
              textDescription={"Choose Date"}
              defaultDate={fromDate}
              dateChanged={dateChanged}
              setDate={(date) => {
                setFromDate(date);
                setDateChange(true);
              }}
            />
          )}

          {dateMode === 2 && (
            <RangePick
              onApply={() => {
                if(toDate <= fromDate){
                    setModal(2)
                    return
                }
                setDateChange(false);
                init();
              }}
              dateChanged={dateChanged}
              textDescription={"Choose Start & End Date"}
              date1={fromDate}
              date2={toDate}
              setDate1={(date) => {
                setDateChange(true);
                setFromDate(date);
              }}
              setDate2={(date) => {
                setDateChange(true);
                setToDate(date);
              }}
            />
          )}

          {selected.length > 0 && (
            <>
              <p className=""> {selected.length} Record Selected </p>
              <p
                className="btn btn-sm mr-2  md:mr-0"
                onClick={() => {
                  setSelected([]);
                }}
              >
                {" "}
                Unselect All{" "}
              </p>
              <p
                onClick={() => {
                  console.log(1);
                  setModal(1);
                }}
                className="btn btn-sm mr-2 md:mr-0 btn-square"
              >
                {" "}
                <IoTrashBinSharp />{" "}
              </p>
            </>
          )}

          <button onClick={()=>setModal(3)} className="btn mt-2 md:mt-0 btn-sm">Export Data<BiExport className="ml-2 text-lg"/> </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto" style={{"maxHeight" : "65vh"}}>
        <table className="mt-2 w-full whitespace-nowrap table-auto rounded-md">
          <thead>
            <tr className="h-16 bg-base-200 rounded-lg shadow-sm">
              <th>
                <input
                  checked={
                    selected.length === detections.length &&
                    detections.length !== 0 &&
                    !loading
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      let fltrd = [];
                      detections.forEach((det, i) => fltrd.push(det._id));
                      setSelected(fltrd);
                    } else setSelected([]);
                  }}
                  type="checkbox"
                  className="checkbox"
                />
              </th>
              <th className="text-left">Detection Date</th>
              <th className=""/>
              <th className="text-right">Pigcount</th>
              <th>Heat Stressed</th>
              <th className="text-left">Normal</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="">
            {detections.map((detection) => (
              <>
                <tr
                  className={`hover:bg-base-300 border-b border-base-100 ${
                    selected.filter((id) => {
                      return id === detection._id;
                    }).length !== 0
                      ? "bg-base-300"
                      : "even:bg-base-100/30"
                  }`}
                >
                  <td>
                    <div className="flex justify-center py-2">
                      <div className="">
                        <input
                          checked={
                            selected.filter((id) => {
                              return id === detection._id;
                            }).length !== 0
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelected([...selected, detection._id]);
                            else
                              setSelected([
                                ...selected.filter((id) => {
                                  return id !== detection._id;
                                }),
                              ]);
                          }}
                          type="checkbox"
                          className="checkbox"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center">
                      <p className="text-base font-medium text-center truncate">
                        {detection.uat
                          ? dateToWord(detection.uat)
                          : dateToWord(new Date())}
                      </p>
                    </div>
                  </td>
                  <td />
                  <td className="">
                    <div className="flex items-center justify-end">
                      <div className="py-1 px-2 rounded-full ">
                        <p className="text-base  font-medium">
                          {detection.data.pig_count}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center">
                      <div className="py-1 px-2 rounded-full ">
                        <p className="text-base  font-medium">
                          {detection.data.stressed_pig}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-start">
                      <div className="py-1 px-2 rounded-full ">
                        <p className="text-base  font-medium">
                          {detection.data.pig_count -
                            detection.data.stressed_pig}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <button
                      onClick={() =>
                        router.push(`/detection_details?_id=${detection._id}`)
                      }
                      className="btn btn-sm btn-outline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {loading && (
          <p className="text-sm my-2 text-center">loading please wait..</p>
        )}
      </div>

      {!loading && detections.length === 0 && (
        <p className="tracking-wider opacity-70 text-sm font-inter text-center my-4">
          There are 0 detections
        </p>
      )}
    </div>
  );
};

export default index;
