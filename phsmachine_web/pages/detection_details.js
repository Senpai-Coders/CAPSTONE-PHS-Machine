import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dateToWord, tempParser } from "../helpers";

import { RiCloseLine } from "react-icons/ri";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { GiPowerLightning, GiTargeting, GiDustCloud } from "react-icons/gi";
import { BsFillLayersFill, BsFolderFill } from "react-icons/bs";
import { TiInfoLarge } from "react-icons/ti";

import Head from "next/head";
import axios from "axios";

export default function _detection_details() {
  const router = useRouter();
  const { _id } = router.query;

  const [loading, setLoading] = useState(true);
  const [detection, setDetection] = useState();
  const [merge, setMerge] = useState(false);
  const [err, setErr] = useState(false);

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
      className="relative mx-4"
    >
      <Head>
        <title>Event View</title>
      </Head>
      <input type="checkbox" id="del-rec-confirm" className="modal-toggle" />
      <div className="modal bg-base-100/60 backdrop-blur-md modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Destroy Data</h3>
            <GiDustCloud className="w-8 h-8" />
          </div>
          <p className="py-4">
            You are about to destroy/delete this record forever, are you sure to
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
            <GiDustCloud className="ml-2 w-5 h-5" />
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
        <section className="mt-8 mx-4 md:mx-8">
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
              <GiDustCloud className="ml-2 w-5 h-5" />
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
                  <img src={`/pig.svg`} className="w-10 h-10" />
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
                <div className="stat-desc">Number of stressed pig</div>
              </div>

              <div className="stat snap-center">
                <div className="stat-figure text-primary">
                  <GiPowerLightning className="w-8 h-8" />
                </div>
                <div className="stat-title">Actions</div>
                <div className="stat-value ">{detection.actions.length}</div>
                <div className="stat-desc">resolving heat stress</div>
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
                src={detection.img_normal}
                alt="detection_image"
              />
              <img
                className="h-64 w-96 shadow-xl rounded-lg object-fill"
                src={detection.img_annotated}
                alt="detection_image"
              />
              <div className="relative h-64 shadow-xl rounded-lg">
                <img
                  className="h-64 w-full rounded-lg object-fill absolute left-0 top-0"
                  src={detection.img_normal}
                />
                <img
                  className="h-64 w-full rounded-lg object-fill saturate-200 absolute left-0 top-0 opacity-60"
                  src={detection.img_thermal}
                />
              </div>
            </div>
          </div>

          <p className="font-inter text-xl mt-8">Detection Breakdown</p>
          <div className="form-control w-40">
            <label className="label cursor-pointer">
              <BsFillLayersFill className="h-7 w-7 mr-2" />
              <span className="label-text">Merge Layers</span>
              <input
                type="checkbox"
                onChange={() => {
                  setMerge(!merge);
                }}
                className="toggle"
              />
            </label>
          </div>

          <div className="mx-auto mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {detection.data.breakdown.map((data, i) => (
              <div key={i} className="bg-base-200 rounded-lg p-5 shadow-xl">
                <p className="font-inter my-2">Pig {i + 1}</p>
                <div
                  className={`duration-300 relative h-64 shadow-xl rounded-lg ${
                    merge ? "opacity-100 z-40" : "hidden z-0"
                  }`}
                >
                  <img
                    className={`h-64 w-full rounded-lg object-fill absolute left-0 top-0 `}
                    src={data.normal_thumb}
                  />
                  <img
                    className="h-64 w-full rounded-lg object-fill saturate-200 absolute left-0 top-0 opacity-60"
                    src={data.thermal_thumb}
                  />
                </div>
                <div
                  className={`duration-300 mt-2 grid gap-2 grid-cols-2 font-inter text-sm ${
                    !merge ? "opacity-100 z-40" : "hidden z-0"
                  }`}
                >
                  <img
                    className="w-64 h-32 rounded-lg"
                    src={data.normal_thumb}
                  />
                  <img
                    className="w-64 h-32 rounded-lg"
                    src={data.thermal_thumb}
                  />
                  <p>normal</p>
                  <p>processed thermal</p>
                </div>
                <div className="mt-2 font-inter">
                  {data.info ? (
                    <>
                      <p className="text-lg">
                        Min Temp:{" "}
                        <span className="font-medium text-primary">
                          {tempParser(data.info.min_temp, 1)} °C
                        </span>{" "}
                      </p>
                      <p className="text-lg">
                        Average Temp:{" "}
                        <span className="font-medium text-primary">
                          {tempParser(data.info.avg_temp, 1)} °C
                        </span>{" "}
                        {"   "}{" "}
                      </p>
                      <p className="text-lg">
                        Max Temp: {"   "}{" "}
                        <span className="font-medium text-error">
                          {tempParser(data.info.max_temp, 1)} °C
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-xs opacity-80"> No Sub Info To Show </p>
                  )}
                </div>
              </div>
            ))}
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
}
