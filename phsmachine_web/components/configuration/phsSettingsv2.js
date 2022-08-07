import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../loading";
import ThemeChoser from "./themeChooser";
import CamLayoutChoser from "./streamLayoutChoser";
import { RebootConfirm, ShutdownConfirm } from "../modals";

import { VscDebugConsole } from "react-icons/vsc";
import { FaPaintRoller, FaPlay, FaStop } from "react-icons/fa";
import { RiLayout4Fill } from "react-icons/ri";
import { FiHardDrive } from "react-icons/fi";
import { MdAutoDelete } from "react-icons/md";
import { AiFillStop } from "react-icons/ai";
import { BiNetworkChart } from "react-icons/bi";
import { BsGear } from "react-icons/bs";
import { TiWarningOutline } from "react-icons/ti";

import { bytesToMegaBytes, mbToGB, getPercentUsage } from "../../helpers";

import axios from "axios";

const phsSettings = ({ autoDelete, state, detectionMode, storageInfo }) => {
  const router = useRouter();
  const [selectedModal, setSelectedModal] = useState(-1);
  const [tempThresh, setTempThresh] = useState(
    detectionMode.value.temperatureThreshold
  );
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [updating, setUpdating] = useState("");

  const [used, setUsed] = useState(0);
  const [free, setFree] = useState(0);
  const [size, setSize] = useState(0);
  const [perc, setPerc] = useState(0);

  useEffect(() => {
    let Size = mbToGB(bytesToMegaBytes(storageInfo.size)),
      Free = mbToGB(bytesToMegaBytes(storageInfo.free)),
      Used = Size - Free;
    setSize(Size.toFixed(1));
    setFree(Free.toFixed(1));
    setUsed(Used.toFixed(1));
    setPerc(getPercentUsage(Size, Used));
  }, [storageInfo]);

  const updateAutoDelete = async () => {
    setUpdating("storage");
    let updateAutoDelete = await axios.post(
      "/api/phs/config/storageAutoDelete",
      { mode: 1, value: !autoDelete.value }
    );
  };

  useEffect(() => {
    setUpdating("");
  }, [autoDelete, storageInfo]);

  const saveChange = async (val) => {
    try {
      setSaving(true);
      setUpdating("autodetect");

      if (val) {
        const updateDetMode = await axios.post(
          "/api/phs/config/detectionMode",
          {
            mode: 1,
            value: {
              mode: val,
              temperatureThreshold: tempThresh,
            },
          }
        );
      } else {
        const updateDetMode = await axios.post(
          "/api/phs/config/detectionMode",
          {
            mode: 1,
            value: {
              mode: false,
              temperatureThreshold: tempThresh,
            },
          }
        );
      }

      setHasChanges(false);
      setSaving(false);
    } catch (e) {}
  };

  useEffect(() => {
    if (hasChanges) return;
    setTempThresh(detectionMode.value.temperatureThreshold);
  }, [detectionMode]);

  return (
    <div className="">
      <ShutdownConfirm
        shown={selectedModal === -2}
        onAccept={() => {
          router.push("/shutdown");
          axios.post("/api/phs/config/power", { mode: 0 });
        }}
        close={() => {
          setSelectedModal(-1);
        }}
      />

      <RebootConfirm
        shown={selectedModal === -3}
        onAccept={() => {
          router.push("/reboot");
          axios.post("/api/phs/config/power", { mode: 1 });
        }}
        close={() => {
          setSelectedModal(-1);
        }}
      />
      {state === -2 && (
        <div className="alert alert-warning shadow-lg my-4 animate-pulse">
          <div className="">
            <TiWarningOutline className="hidden sm:block h-4 w-4" />
            <span>
              You cannot update some configuration because the core system is
              off
            </span>
          </div>
        </div>
      )}

      <div className="mx-1 md:mx-2 rounded-md p-4 md:p-4 outline  bg-base-100 shadow-sm outline-1 outline-base-300">
        {/** Simple Control & Status */}

        <p className="font-inter font-medium mb-2 text-lg md:text-xl">
          System State
        </p>
        <div
          className={`grid grid-cols-1 w-full ${
            state === -2 || state === 3 ? "opacity-50" : ""
          }`}
        >
          <div className="mt-2 card ">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <VscDebugConsole className="w-6 h-6" />
                    </div>
                    <p className="text-lg"> Debug Mode</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    This will disable detection & actions
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled={state === -2}
                  className="toggle mt-4 md:mt-0"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 card">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <AiFillStop className="w-6 h-6" />
                    </div>
                    <p className="text-lg"> Disable PHS</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    When disabled, the system cannot detect & will not do any
                    actions. You can also be able to toggle relays manually
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled={state === -2}
                  className="toggle mt-4 md:mt-0"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 card">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      {/* <AiFillStop className="w-6 h-6" /> */}
                    </div>
                    <p className="text-lg">Stop All Actions</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    This will stop all ongoing actions
                  </p>
                </div>
                <button
                  disabled={state === -2}
                  className="btn btn-error btn-sm mt-4 md:mt-0"
                >
                  stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-1 md:mx-2 rounded-md p-4 md:p-4 outline mt-4 bg-base-100 shadow-sm outline-1 outline-base-300">
        {updating === "autodetect" && <Loading />}
        <p className="font-inter font-medium mb-2 text-lg md:text-xl">
          Heat Stress Detection
        </p>
        <div className="">
          <div className=" md:flex items-center justify-between">
            <div className="mr-4">
              <div className="flex items-center justify-start mb-2">
                <div className="p-2 rounded-xl bg-base-300 mr-2">
                  <BiNetworkChart className="w-6 h-6" />
                </div>
                <p className="text-lg">Automatic Detection</p>
              </div>
              <p className="text-xs md:text-sm">
                Let PHS AI identify Heatstressed pig automatically.
              </p>
            </div>
            <input
              type="checkbox"
              className="toggle mt-4 md:mt-0"
              onChange={(e) => {
                saveChange(e.target.checked);
              }}
              checked={detectionMode.value.mode}
            />
          </div>

          {!detectionMode.value.mode && (
            <>
              <div class="divider"></div>
              <div className="">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <BsGear className="w-6 h-6" />
                    </div>
                    <p className="text-lg">Manual Detection</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    When Automatic Detection is disabled, manual detection will
                    be used & the threshold temperature will be the basis for
                    identifying heatstress
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex items-center">
                    <p className="mr-2">Temperature Heat Stress Threshold</p>
                  </div>
                  <div className="md:flex md:items-center">
                    {/* <p className="p-2 w-1/12 font-mono text-3xl bg-neutral rounded-box text-neutral-content mr-2">
                    {tempThresh}°C 
                </p> */}
                    <div className="form-control drop-shadow-lg mr-3">
                      <label className="input-group input-group-sm">
                        <input
                          type="number"
                          onChange={(e) => {
                            if (isNaN(Number.parseFloat(e.target.value)))
                              return;
                            setHasChanges(true);
                            setTempThresh(Number.parseFloat(e.target.value));
                          }}
                          placeholder="Enter Temperature °C"
                          value={tempThresh}
                          className="input w-full text-2xl font-mono max-w-xs text-neutral-content bg-neutral "
                        />
                        <span className="text-3xl">°C</span>
                      </label>
                    </div>

                    <input
                      type="range"
                      min="0"
                      step="0.1"
                      max="100"
                      value={tempThresh}
                      onChange={(e) => {
                        setTempThresh(e.target.value);
                        setHasChanges(true);
                      }}
                      className="drop-shadow-lg mt-6 md:mt-0 w-full md:w-11/12 range range-sm"
                    />
                  </div>
                </div>
                {tempThresh !== detectionMode.value.temperatureThreshold && (
                  <div className="btn-group mt-4">
                    <button
                      onClick={() => {
                        saveChange();
                      }}
                      className={`btn ${saving ? "loading" : ""}`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        if (!saving)
                          setTempThresh(
                            detectionMode.value.temperatureThreshold
                          );
                      }}
                      className="btn"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-1 md:mx-2 overflow-visible rounded-md p-4 md:p-4 outline mt-4 bg-base-100 shadow-sm outline-1 outline-base-300">
        <p className="font-inter font-medium mb-2 text-lg md:text-xl">UI</p>
        <div className={`grid grid-cols-1 w-full`}>
          <div className="mt-2 card overflow-visible">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <FaPaintRoller className="w-6 h-6" />
                    </div>
                    <p className="text-lg">System Theme</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    Choose theme based on your preference
                  </p>
                </div>
                <div className=" mt-4 md:mt-0">
                  <ThemeChoser textMode={true} />
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="mt-2 card  overflow-visible">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <RiLayout4Fill className="w-6 h-6" />
                    </div>
                    <p className="text-lg">Stream Layout</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    Choose your prefered realtime video feed layout
                  </p>
                </div>
                <div className=" mt-4 md:mt-0">
                  <CamLayoutChoser textMode={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-1 md:mx-2 overflow-visible rounded-md p-4 md:p-4 outline mt-4 bg-base-100 shadow-sm outline-1 outline-base-300">
        {updating === "storage" && <Loading />}
        <p className="font-inter font-medium mb-2 text-lg md:text-xl">
          System Storage
        </p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center" >
            <div className="p-2 rounded-xl bg-base-300 mr-2">
              <FiHardDrive className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <p className="">
                {used} GB used out of {size} Gb ({perc.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        <progress
          className="mx-2 progress progress-primary"
          value={used}
          max={size}
        ></progress>
        <p className="text-warning text-xs md:text-sm my-2">
          If the storage get's too small, PHS will stop saving detections & you
          must delete some detection records to free up storage space
        </p>
        <div className="divider"></div>
        <div className="mt-2 card ">
          <div className="card-body p-2">
            <div className="md:flex items-center justify-between">
              <div className="mr-4">
                <div className="flex items-center justify-start mb-2">
                  <div className="p-2 rounded-xl bg-base-300 mr-2">
                    <MdAutoDelete className="w-6 h-6" />
                  </div>
                  <p className="text-lg">Automatic Record Deletion</p>
                </div>
                <p className="text-xs md:text-sm">
                  Automatically delete older detection record if the used
                  storage exceed 95% of the systems total storage space in order
                  to store new records & prevent unexpected system malfunctions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoDelete.value}
                onChange={(e) => {
                  updateAutoDelete();
                }}
                className="toggle  mt-4 md:mt-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-2 mt-8 font-mono">
        <p>System Information</p>
        <p>
          PHS Version : <span>1.0</span>
        </p>
        <p>
          Python : <span>3.8</span>
        </p>
        <p>
          Server : <span>NextJs/Flask</span>
        </p>
        <p>
          Database : <span>MongoDB</span>
        </p>
        <p>
          PHS System Type : <span>Standalone</span>
        </p>
        <p>
          OS : <span>Raspberry Pi 0s</span>
        </p>
      </div>
    </div>
  );
};

export default phsSettings;
