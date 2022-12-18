import Layout from "../components/layout";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dateToWord, tempParser } from "../helpers";

import { RiCloseLine } from "react-icons/ri";
import { FaTemperatureHigh, FaTemperatureLow, FaLongArrowAltRight } from "react-icons/fa";
import { GiPowerLightning } from "react-icons/gi";
import { BsFolderFill, BsFillTrash2Fill } from "react-icons/bs";
import { TiInfoLarge } from "react-icons/ti";
import { MdScience } from "react-icons/md";
import { HiOutlineArrowSmDown } from "react-icons/hi";
import { BiMerge } from "react-icons/bi";

import Head from "next/head";
import axios from "axios";
import HeatmapRaw from "../components/heatmapRaw";

import { appendToFSUrl } from "../helpers";

const _detection_details = () => {
  const router = useRouter();
  const { _id } = router.query;

  const [loading, setLoading] = useState(true);
  const [detection, setDetection] = useState();
  const [err, setErr] = useState(false);

  const [selected, setSelected] = useState(-1);
  const [merge, setMerge] = useState(false);

  const init = async () => {
    try {
      if (!_id) return;
      const resp = await axios.post("/api/phs/detection", {
        mode: 1,
        detection_id: _id,
      });
      setDetection(resp.data.detection_data);
      setLoading(false);
      setErr(false);
    } catch (e) {
      console.log(e);
      setErr(true);
      setLoading(false);
    }
  };

  const toggleMarked = async (val) => {
    try {
      if (!_id) return;
      const resp = await axios.post("/api/phs/detection", {
        mode: 2,
        detection_id: _id,
        updates: {
          detection_type: val,
        },
      });
      init();
    } catch (e) {
      console.log(e);
    }
  };

  const goBack = () => {
    let goBacks = router.back();
    if (goBacks === undefined) {
      close();
    }
  };

  const del = async () => {
    try {
      if (!_id) return;

      var focPath = detection.img_normal;
      var fslash = focPath.indexOf("/", 1);
      var sslash = focPath.indexOf("/", fslash + 1);
      var delFold = focPath.substring(fslash + 1, sslash);
      const resp = await axios.post("/api/phs/detection", {
        mode: -1,
        detection_id: _id,
        path: delFold,
      });
      goBack();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, [_id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <Head>
        <title>Event View</title>
      </Head>

      <div
        className={`modal backdrop-blur-lg ${
          selected !== -1 ? "modal-open" : ""
        }`}
      >
        <div className="modal-box w-11/12 h-fit max-w-5xl">
          <h3 className="font-bold text-lg">Thermal Map</h3>
          <div style={{ height: "70vh" }}>
            {selected !== -1 && (
              <HeatmapRaw
                chartName={`Raw Heatmap - Pig ${selected + 1}`}
                textColor={"#7d6d72"}
                title={`Raw HeatMap`}
                subTitle={`Pig ${+1}`}
                data={detection.data.breakdown[selected].raw}
              />
            )}
          </div>
          <div className="modal-action">
            <label
              onClick={() => {
                setSelected(-1);
              }}
              className="btn"
            >
              close
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="del-rec-confirm" className="modal-toggle" />

      <div className="modal bg-base-100/60 backdrop-blur-md modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Destroy Data</h3>
            <BsFillTrash2Fill className="w-8 h-8" />
          </div>
          <p className="py-4">
            You are about to destroy/delete this record forever. Do you want to
            proceed?
          </p>
          <div className="modal-action">
            <label htmlFor="del-rec-confirm" className="btn">
              No
            </label>
            <button onClick={() => del()} className="btn">
              Yes delete it!
            </button>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center top-0 right-0 space-x-4 mx-8 absolute">
        {!loading && !err && (
          <label
            htmlFor="del-rec-confirm"
            className="btn btn-sm modal-button btn-outline"
          >
            Delete Record
            <BsFillTrash2Fill className="ml-2 w-5 h-5" />
          </label>
        )}
        <button
          onClick={() => {
            goBack();
          }}
          className="btn btn-sm btn-square btn-outline"
        >
          <RiCloseLine className="w-5 h-5 " />
        </button>
      </div>

      {loading && (
        <div className=" absolute top-10 left-0 mx-10 w-1/12 flex items-center space-x-4">
          <p className="w-full animate-pulse">Loading</p>
          <progress className="progress"></progress>
        </div>
      )}
      {loading && (
        <div className="flex p-32 items-center justify-center">
          <h1 className="font-inter">
            loading data, this may take a while, please wait.
          </h1>
        </div>
      )}
      {err && (
        <div className="flex p-32 mt-8 items-center justify-center">
          <h1 className="font-inter text-error">
            Sorry, but we cannot retrieve this record, the record might be
            deleted or corrupted. Please go back and reload the web page.
          </h1>
        </div>
      )}
      {!loading && !err && (
        <section className="mt-8 sm:mx-1 md:mx-8">
          <p className="font-inter text-lg">
            Detection Date -{" "}
            <span className="font-lato text-sm">
              {dateToWord(detection.cat)}
            </span>
          </p>

          <div className="my-4 space-y-2 space-x-2 flex flex-wrap sm:hidden items-center">
            <label
              htmlFor="del-rec-confirm"
              className="btn btn-sm modal-button btn-outline"
            >
              Delete Record
              <BsFillTrash2Fill className="ml-2 w-5 h-5" />
            </label>
            <button
              onClick={() => {
                goBack();
              }}
              className="btn btn-sm btn-square btn-outline"
            >
              <RiCloseLine className="w-5 h-5 " />
            </button>
          </div>

          <p className="font-inter text-lg">
            Detection ID -{" "}
            <span className="font-lato text-sm">{detection._id}</span>
          </p>

          <div className="my-4 text-sm alert shadow-lg">
            <div>
              <BsFolderFill className="stroke-info text-accent flex-shrink-0 w-6 h-6" />
              <span className="font-inter">
                Raw Data & Images can be found at{" "}
                <span className="break-all font-semibold ">
                  phsmachine_web/public
                  {`${detection.img_normal.substring(
                    0,
                    detection.img_normal.lastIndexOf("/")
                  )}`}
                </span>
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="stats card bg-base-200 overflow-x-scroll snap-x rounded-box mt-8 font-inter shadow">
              <div className="stat snap-center">
                <div className="stat-figure text-primary">
                  <img src={appendToFSUrl(`/pig.png`)} className="w-10 h-10" />
                </div>
                <div className="stat-title">Identified Pig</div>
                <div className="stat-value text-primary">
                  {detection.data.pig_count}
                </div>
                <div className="stat-desc"></div>
              </div>

              <div className="stat snap-center text-error">
                <div className="stat-figure ">
                  <FaTemperatureHigh className="w-8 h-8" />
                </div>
                <div className="stat-title">Stressed Pig</div>
                <div className="stat-value ">{detection.data.stressed_pig}</div>
              </div>

              <div className="stat snap-center">
                <div className="stat-figure text-primary">
                  <GiPowerLightning className="w-8 h-8" />
                </div>
                <div className="stat-title">Actions</div>
                <div className="stat-value ">{detection.actions ? detection.actions.length : 0}</div>
                <div className="stat-desc">to resolving heat stress</div>
              </div>

              <div className="stat snap-center">
                <div className="stat-figure text-blue-500">
                  <FaTemperatureLow className="w-8 h-8" />
                </div>
                <div className="stat-title">Minimum Temp</div>
                <div className="stat-value ">
                  {tempParser(detection.data.min_temp, 1)} C
                </div>
                <div className="stat-desc"></div>
              </div>

              <div className="stat snap-center">
                <div className="stat-figure text-primary">
                  <FaTemperatureLow className="w-8 h-8" />
                </div>
                <div className="stat-title">Average Temp</div>
                <div className="stat-value ">
                  {tempParser(detection.data.avg_temp, 1)} C
                </div>
                <div className="stat-desc"></div>
              </div>

              <div className="stat snap-center text-error">
                <div className="stat-figure">
                  <FaTemperatureHigh className="w-8 h-8" />
                </div>
                <div className="stat-title">Maximum Temp</div>
                <div className="stat-value ">
                  {tempParser(detection.data.max_temp, 1)} C
                </div>
                <div className="stat-desc"></div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <img
                className="h-64 w-96 shadow-xl rounded-lg object-fill"
                src={appendToFSUrl(detection.img_normal)}
                alt="detection_image"
              />
              <img
                className="h-64 w-96 shadow-xl rounded-lg object-fill"
                src={appendToFSUrl(detection.img_annotated)}
                alt="detection_image"
              />
              <div className="relative h-64 shadow-xl rounded-lg">
                <img
                  className="h-64 w-full rounded-lg object-fill absolute left-0 top-0"
                  src={appendToFSUrl(detection.img_normal)}
                />
                <img
                  className="h-64 w-full rounded-lg object-fill saturate-200 absolute left-0 top-0 opacity-60"
                  src={appendToFSUrl(detection.img_thermal)}
                />
              </div>
            </div>
          </div>

          <p className="font-inter text-xl mt-8">Detection Breakdown</p>

          <button
            onClick={() => {
              setMerge(!merge);
            }}
            className="btn btn-sm btn-active mt-4"
          >
            <BiMerge className="text-xl mr-2" /> Merge View
          </button>

          <div className="flex mt-4 flex-wrap">
            {detection.data.breakdown.map((data, nth) => (
              //   <BreakDown key={i} data={data} nth={i} />
              <div key={nth} className="p-3 w-full sm:w-1/2 md:w-1/3">
                <div className="card bg-neutral overflow-visible shadow-lg">
                  <div className="flex justify-between items-center p-4">
                    <div className="flex justify-start items-center">
                      <div className="avatar">
                        <div className="w-12 mask mask-squircle">
                          <img src={appendToFSUrl(data.normal_thumb)} />
                        </div>
                      </div>
                      <p className="ml-2 text-neutral text-lg">Pig {nth + 1}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="tooltip " data-tip="View Raw Heat Map">
                        <button
                          onClick={() => {
                            setSelected(nth);
                          }}
                          className="btn btn-square btn-sm btn-active mr-2"
                        >
                          <MdScience className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="shadow-inner mt-2 p-4 bg-base-100 outline outline-1 outline-base-100 flex items-center justify-evenly">
                    <div className="flex flex-col items-center">
                      <p className="w-1/3 text-left  flex items-center">Max </p>
                      <HiOutlineArrowSmDown className="mx-2" />{" "}
                      <p className="font-bold text-error/90 font-mono">
                        {" "}
                        {data.info.max_temp.toFixed(2)}°C
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className=" w-1/3 text-center flex items-center">
                        Avg{" "}
                      </p>
                      <HiOutlineArrowSmDown className="mx-2" />{" "}
                      <p className="font-bold font-mono text-warning">
                        {data.info.avg_temp.toFixed(2)}°C
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className=" w-1/3 text-right  flex items-center text-netural-content">
                        Min{" "}
                      </p>
                      <HiOutlineArrowSmDown className="mx-2" />{" "}
                      <p className="font-bold font-mono  ">
                        {data.info.min_temp.toFixed(2)}°C
                      </p>
                    </div>
                  </div>

                  {!merge ? (
                    <div className=" bg-base-100 p-2 flex items-center justify-between">
                      <img
                        className="w-1/2"
                        src={appendToFSUrl(data.normal_thumb)}
                      />
                      <img
                        className="w-1/2"
                        src={appendToFSUrl(data.thermal_thumb)}
                      />
                    </div>
                  ) : (
                    <div className="bg-base-100 h-[24rem] p-2 flex items-center justify-between relative">
                      <img
                        className="absolute top-0 left-0 w-full h-[23rem]"
                        src={appendToFSUrl(data.normal_thumb)}
                      />
                      <img
                        className="absolute top-0 left-0 opacity-70 h-[23rem] w-full saturate-100"
                        src={appendToFSUrl(data.thermal_thumb)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-8 text-xl">Actions performed</p>

          <div className="mt-4 max-h-screen overflow-scroll w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Action Name</th>
                  <th>Event Caller</th>
                  <th>Relay Used &amp; Duration</th>
                </tr>
              </thead>
              <tbody>
                {detection.actions && detection.actions.map((act, idx) => (
                  <tr key={idx}>
                    <td>
                      <div>
                        <div className="font-bold">{act[0].action_name}</div>
                      </div>
                    </td>
                    <td>
                      <span className="">{act[0].caller}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {act.map((rel, idxx) => (
                          <div key={idxx} className="px-4 py-2 bg-base-300 rounded-3xl gap-2 flex items-center">
                            <span>Relay : {rel.relay_name}</span>
                            <FaLongArrowAltRight className="text-xl"/>
                            <span className="">{rel.duration}s</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-8 text-sm alert shadow-lg">
            <div>
              <TiInfoLarge className="stroke-info flex-shrink-0 w-6 h-6" />
              <span>
                You can mark this as accurate or unaccurate for future
                improvement/training of the AI model in detecting pig heat
                stress
              </span>
            </div>
            <div className="flex-none">
              <div className="form-control w-40">
                <label className="label cursor-pointer">
                  <input
                    onChange={() => {}}
                    onClick={() => {
                      toggleMarked(!detection.detection_type);
                    }}
                    type="checkbox"
                    checked={detection.detection_type}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text mr-2">Mark As Accurate </span>
                </label>
              </div>
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

_detection_details.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default _detection_details;
