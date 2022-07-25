import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { IoReloadCircleSharp } from "react-icons/io5";

const index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState([]);

  const [selected, setSelected] = useState([]);

  const [filterMode, setFilterMode] = useState([0]); // 0 - all, 1 ( Only One Specific Date), 2 ( ranged )

  const filterer = () => {};

  const init = async () => {
    try {
      setLoading(true);
      const resp = await axios.post("/api/phs/detection", { mode: 0 });
      setDetections(resp.data.detection_data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="relative mt-8 min-h-screen">
      {loading && (
        <div className="right-0 top-0 w-1/12 flex absolute items-center space-x-4">
          <progress className="progress"></progress>
        </div>
      )}

      <div className="px-4 ">
        <div className="flex items-center space-x-2 justify-start">
          <p className="btn btn-sm" onClick={() => init()}>
            <IoReloadCircleSharp className="mr-2" />
            Refresh{" "}
          </p>
          {selected.length > 0 && (
            <>
              <p className=""> {selected.length} Record Selected </p>
              <p
                className="btn btn-sm"
                onClick={() => {
                  setSelected([]);
                }}
              >
                {" "}
                Unselect All{" "}
              </p>
              <p className="btn btn-sm"> Delete Selected </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="mt-2 w-full whitespace-nowrap table-auto rounded-md">
          <thead>
            <tr className="h-16 bg-base-200 rounded-lg shadow-sm">
              <th>
                <input
                  checked={selected.length === detections.length && !loading}
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
              <th />
              <th className="text-right">Pigcount</th>
              <th>Heat Stressed</th>
              <th className="text-left">Normal</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="">
            {detections.map((detection) => (
              <>
                <tr className="even:bg-base-100/30 border-b border-base-100">
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
                      <p className="text-base font-medium text-center">
                        11/11/2021
                      </p>
                    </div>
                  </td>
                  <td />
                  <td className="">
                    <div className="flex items-center justify-end">
                      <div className="py-1 px-2 rounded-full ">
                        <p className="text-base  font-medium">9</p>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center">
                      <div className="py-1 px-2 rounded-full ">
                        <p className="text-base  font-medium">3</p>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-start">
                      <div className="py-1 px-2 rounded-full ">
                        <p className="text-base  font-medium">6</p>
                      </div>
                    </div>
                  </td>
                  <td className="pl-4">
                    <button
                      onClick={() =>
                        router.push(`/detection_details?_id=${detection._id}`)
                      }
                      className="btn btn-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/** OLD VERSION */}
      {/* <div className="grid gap-4 md:grid-cols-2">
        {detections.map((record) => (
          <div<button className="btn btn-circle">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
</button>
            key={record._id}
            className="card md:card-side space-x-2 shadow-xl"
          >
            <figure className="md:w-1/2 flex">
              <img
                className="rounded-l-lg object-cover h-full w-1/2"
                src={record.img_normal}
              ></img>
              <img
                className=" rounded-r-lg object-cover h-full w-1/2"
                src={record.img_thermal}
              ></img>
            </figure>
            <div className="md:w-1/2 card-body font-inter">
              <p className="font-bold text-lg">
                {record.data.pig_count} Pigs Onframe
              </p>
              <p className="text-lg">
                Min Temp:{" "}
                <span className="font-medium text-primary">
                  {tempParser(record.data.min_temp)} °C
                </span>{" "}
              </p>
              <p className="text-lg">
                Average Temp:{" "}
                <span className="font-medium text-primary">
                  {tempParser(record.data.avg_temp)} °°C
                </span>{" "}
                {"   "}{" "}
              </p>
              <p className="text-lg">
                Max Temp: {"   "}{" "}
                <span className="font-medium text-error">
                  {tempParser(record.data.max_temp)}°C
                </span>
              </p>
              <p className="font-bold text-lg">
                <span className="text-warning">{record.data.stressed_pig}</span>{" "}
                Stressed Pig
              </p>
              <p className="text-sm">{record.date}</p>
              <div className="card-actions justify-end">
                <button
                  onClick={() =>
                    router.push(`/detection_details?_id=${record._id}`)
                  }
                  className="btn btn-block"
                >
                  More Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {!loading && detections.length === 0 && (
        <p className="tracking-wider opacity-70 text-sm font-inter text-center">
          There are 0 detections
        </p>
      )}
    </div>
  );
};

export default index;
