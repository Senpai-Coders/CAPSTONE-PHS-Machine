import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HoverHelp from "../hoverHelp";
import ThemeChoser from "./themeChooser";
import CamLayoutChoser from "./streamLayoutChoser";
import { RebootConfirm, ShutdownConfirm } from "../modals";

import { VscDebugConsole } from "react-icons/vsc";
import { FaPaintRoller, FaPlay, FaStop } from "react-icons/fa";
import { RiLayout4Fill } from "react-icons/ri";
import { FiHardDrive } from "react-icons/fi";
import { MdAutoDelete } from "react-icons/md"

import { bytesToMegaBytes, mbToGB, getPercentUsage } from "../../helpers";

import axios from "axios";

const phsSettings = ({ state, detectionMode, storageInfo }) => {
  const router = useRouter();
  const [selectedModal, setSelectedModal] = useState(-1);
  const [tempThresh, setTempThresh] = useState(
    detectionMode.value.temperatureThreshold
  );
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const saveChange = async (val) => {
    try {
      setSaving(true);

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
    <div>
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

      <div className="mx-1 md:mx-2">
        {/** Simple Control & Status */}
        <p className="font-medium mb-4 text-xl">System State</p>
        {state === -2 && (
          <p className="text-error animate-pulse my-4">
            {" "}
            You cannot update some configuration because the core system is off
          </p>
        )}
        <div
          className={`grid grid-cols-1 md:mx-3/12 md:p-4 w-full ${
            state === -2 || state === 3 ? "opacity-50" : ""
          }`}
        >
          <div className="mx-0 md:m-2 outline outline-1 outline-base-300 card bg-base-100 shadow-md">
            <div className="card-body p-2 md:p-4 ">
              <div className="md:flex items-center justify-between">
                <div className="md:flex items-center justify-start mr-4">
                  <VscDebugConsole className="mb-2 md:block  w-8 h-8  mr-8" />
                  <div>
                    <p className="text-lg">Debug Mode</p>
                    <p className="text-xs">
                      This will disable detection & actions
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={state === -2}
                  className="toggle mt-4 md:mt-0"
                />
              </div>
            </div>
          </div>

          <div className="mx-0 md:m-2 outline outline-1 outline-base-300 card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <VscDebugConsole className="hidden md:block  w-8 h-8  mr-8" />
                  <div>
                    <p className="text-lg">Disable PHS</p>
                    <p className="text-sm">
                      When disabled, the system cannot detect & will not do
                      any actions. You can also be able to toggle relays manually
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={state === -2}
                  className="toggle"
                />
              </div>
            </div>
          </div>

          <div className="mx-0 md:m-2 outline outline-1 outline-base-300 card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <VscDebugConsole className="hidden md:block  w-8 h-8  mr-8" />
                  <div>
                    <p className="text-lg">Stop All Actions</p>
                    <p className="text-sm">
                      This will stop all ongoing actions
                    </p>
                  </div>
                </div>
                <label className="swap">
                  <input type="checkbox" disabled={state === -2} />
                  <FaPlay className="swap-on w-6 h-6" />
                  <FaStop className="swap-off w-6 h-6" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-2 mt-8">
        <p className="font-medium text-xl mb-4">Heat Stress Detection</p>

        <div className="bg-base-300 rounded-md outline outline-1 outline-base-200 p-8">
          <div className=" flex items-center justify-between">
            <div className="flex justify-start">
              <p className="font-medium text-lg mr-2">Automatic Detection</p>
              <HoverHelp
                tooltipText={"Let PHS built in AI to identify heat stress"}
              />
            </div>
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => {
                saveChange(e.target.checked);
              }}
              checked={detectionMode.value.mode}
            />
          </div>

          {!detectionMode.value.mode && (
            <div className=" mt-8">
              <p className="font-medium text-lg mb-4">Manual Detection</p>
              <div>
                <div className="mb-4 flex items-center">
                  <p className="mr-2">Temperature Heat Stress Threshold</p>
                  <HoverHelp
                    tooltipText={
                      "Temperature on which the system will use as a basis for identifying pig temperature as Heat Stress"
                    }
                  />
                </div>
                <div className="md:flex md:items-center">
                  {/* <p className="p-2 w-1/12 font-mono text-3xl bg-neutral rounded-box text-neutral-content mr-2">
                    {tempThresh}°C 
                </p> */}
                  <div className="form-control shadow-lg mr-3">
                    <label className="input-group input-group-sm">
                      <input
                        type="number"
                        onChange={(e) => {
                          if (isNaN(Number.parseFloat(e.target.value))) return;
                          setHasChanges(true);
                          setTempThresh(Number.parseFloat(e.target.value));
                        }}
                        placeholder="Enter Temperature °C"
                        value={tempThresh}
                        className="input w-full text-3xl font-mono max-w-xs text-neutral-content bg-neutral "
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
                    className="mt-6 md:mt-0 w-full md:w-11/12 range range-sm"
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
                        setTempThresh(detectionMode.value.temperatureThreshold);
                    }}
                    className="btn"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mx-2 mt-8">
        <p className="font-medium text-xl mb-4">System UI</p>

        <div
          className={`grid grid-cols-1 md:mx-3/12 p-0 md:p-4 md:grid-cols-2 w-full`}
        >
          <div className="m-2 overflow-visible outline outline-1 outline-base-300 card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <FaPaintRoller className="hidden md:block  w-8 h-8  mr-8" />
                  <div>
                    <p className="text-lg">System Theme</p>
                    <p className="text-sm">
                      Choose theme based on your preference
                    </p>
                  </div>
                </div>
                <ThemeChoser textMode={true} />
              </div>
            </div>
          </div>

          <div className="m-2 outline outline-1 overflow-visible outline-base-300 card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <RiLayout4Fill className="hidden md:block  w-8 h-8  mr-8" />
                  <div>
                    <p className="text-lg">Stream Layout</p>
                    <p className="text-sm">Choose realtime video feed layout</p>
                  </div>
                </div>
                <CamLayoutChoser textMode={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-2 mt-8">
        <p className="font-medium text-xl mb-4">System Storage</p>

        <div className="shadow-lg rounded-2xl p-4 card bg-base-100 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="rounded-xl relative p-2 ">
                <FiHardDrive className="text-secondary w-8 h-8" />
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-md  ml-2">
                  PHS Server Storage
                </span>
              </div>
            </div>
          </div>
          <p className="ml-4">
            {used} GB used out of {size} Gb ({perc.toFixed(1)}%)
          </p>
          <progress
            className="mt-1 ml-4 progress progress-primary"
            value={used}
            max={size}
          ></progress>

          <div className="md:m-2 md:w-1/2 card shadow-md">
            <div className="card-body m-0 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <div>
                    <div className="flex items-center">
                        <MdAutoDelete className="hidden md:block h-8 w-8" />
                        <p className="text-lg ml-2">
                        Automatic Record Deletion</p>
                    </div>
                    <p className="hidden md:block text-sm my-2 opacity-90">
                      Automatically delete older detection record if
                      theres 8% free storage left in order to store new records & prevent unexpected malfunctions
                    </p>
                  </div>
                </div>
                <input type="checkbox" className="ml-2 toggle" />
              </div>
            </div>
          </div>

          <p className="text-warning text-xs mt-2">
            If the storage get's too small, PHS will stop saving detections &
            you must delete some detection records to free some storage
          </p>
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
