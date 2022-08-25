import { useState } from "react";
import axios from "axios";

import { RiListSettingsFill, RiTimerFill } from "react-icons/ri";
import { MdMyLocation, MdClose } from "react-icons/md";
import { GiProcessor } from "react-icons/gi";
import { GoCircuitBoard } from "react-icons/go";
import { CgDetailsLess } from "react-icons/cg";
import { FaHandSparkles } from "react-icons/fa";

import { PI_IP } from "../../../helpers";

const actionComponent = ({ relayOptions, close, onSave, divisionCount }) => {
  const [config_name, setConfig_name] = useState("");
  const [description, setDescription] = useState("");

  const [caller, setCaller] = useState("");
  const [eventLocation, setEventLocation] = useState(-1);

  const [targets, setTargets] = useState([]);
  const [forceActivate, setForceActivate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState(1);

  const save = async (md) => {
    try {
      setLoading(true);
      onSave(true);
      console.log("saving");
      const add = await axios.post("/api/phs/config/actions", {
        mode: md,
        config_name,
        description,
        value: {
          targets,
          caller,
          forceActivate,
          eventLocation,
        },
      });

      console.log(add.data);
      setLoading(false);
      close();
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.status === 409) setErr(e.response.data.message);
      }
    }
  };

  const canSave = () => {
    if (config_name.length === 0) return false;
    if (description.length === 0) return false;
    if (caller.length === 0) return false;
    if (targets.length === 0) return false;

    if (!forceActivate) {
      if (eventLocation === -1) return;
    }

    return true;
  };

  const updateSpecificTarget = (idx, mode, relay, duration) => {
    let copyTargets = [...targets];
    if (mode) copyTargets[idx].target_relay = relay;
    else copyTargets[idx].duration = duration;
    setTargets([...copyTargets]);
  };

  return (
    <>
      <div className="shadow-md py-4 outline outline-1 outline-base-300 bg-base-100 rounded-md my-2 px-3 md:px-4">
        <div className="flex items-center justify-between">
          <div className="form-control">
            <div className="flex items-center justify-start mb-2">
              <div className="p-2 rounded-xl bg-base-300 mr-2">
                <RiListSettingsFill className="w-6 h-6" />
              </div>
              <p className="text-lg">Action Name</p>
            </div>
            <input
              type="text"
              placeholder=""
              onChange={(e) => {
                setConfig_name(e.target.value);
              }}
              required
              value={config_name}
              className={`tracking-wider input input-bordered w-full input-md`}
            />
          </div>
        </div>

        <div className="form-control mt-4">
          <div className="flex items-center justify-start mb-2">
            <div className="p-2 rounded-xl bg-base-300 mr-2">
              <CgDetailsLess className="w-6 h-6" />
            </div>
            <p className="text-lg">Description</p>
          </div>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
          ></textarea>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-start mb-2">
            <div className="p-2 rounded-xl bg-base-300 mr-2">
              <GoCircuitBoard className="w-6 h-6" />
            </div>
            <p className="text-lg">Target Relays</p>
          </div>
          <div className="grid mt-4 grid-cols-2 gap-1">
            <p>Relay</p>
            <p>Duration (Seconds)</p>
            {targets.map((i, idx) => (
              <>
                <div className="dropdown w-full">
                  <label tabindex="0" className="btn w-full">
                    Relay : {i.target_relay}
                  </label>
                  <ul
                    tabindex="0"
                    className="dropdown-content menu max-h-56 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 border-b border-l border-r border-base-300 rounded-sm"
                  >
                    {[
                      4, 14, 15, 17, 18, 27, 22, 23, 24, 10, 9, 25, 11, 8, 7, 0,
                      1, 5, 6, 12, 13, 19, 16, 26, 20, 21,
                    ].map((rel, id) => (
                      <li
                        tabIndex={i + 1}
                        key={id}
                        onClick={() => updateSpecificTarget(idx, true, rel)}
                        className={`cursor-pointer duration-100 m-1 snap-center ${
                          i.target_relay === rel
                            ? "bg-base-200 outline outline-1"
                            : ""
                        }`}
                      >
                        <div className="flex p-4 justify-between">
                          <p className="text-md">{rel}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="items-center flex">
                  <input
                    type="number"
                    onChange={(e) => {
                      let val = e.target.value;

                      if (isNaN(Number.parseInt(val))) return;

                      val = Number.parseInt(val);
                      if (val <= 0) return;
                      updateSpecificTarget(idx, false, i.target_relay, val);
                    }}
                    placeholder="Enter Duration"
                    value={i.duration}
                    className="input text-lg w-full font-mono text-neutral-content bg-neutral "
                  />
                  <div
                    className="btn ml-2 text-lg"
                    onClick={() => {
                      let targs = [...targets];
                      targs.splice(idx, 1);
                      setTargets(targs);
                    }}
                  >
                    <MdClose className="" />
                  </div>
                </div>
              </>
            ))}
          </div>
          <button
            onClick={() =>
              setTargets([...targets, { target_relay: 18, duration: 1 }])
            }
            className="mt-2 btn btn-md btn-block"
          >
            Add Target
          </button>
        </div>

        {/*
        
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

        <div className="mt-4">
          <div className="flex items-center justify-start mb-2">
            <div className="p-2 rounded-xl bg-base-300 mr-2">
              <GoCircuitBoard className="w-6 h-6" />
            </div>
            <p className="text-lg">Target Relay</p>
          </div>
          <select
            placeholder="Choose AI that will handle this action"
            value={target_relay}
            onChange={(e) => {
              setTargetRelay(e.target.value);
            }}
            className="select select-bordered w-full max-w-xs"
          >
            <option>Select Target Relay</option>
            {target_relay.length !== 0 &&
              target_relay !== "Select Target Relay" && (
                <option>{target_relay}</option>
              )}
            {relayOptions
              .filter((rel, i) => {
                return !rel.value.isUsed;
              })
              .map((rel, i) => (
                <option key={i}>{rel.config_name}</option>
              ))}
          </select>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-start mb-2">
            <div className="p-2 rounded-xl bg-base-300 mr-2">
              <RiTimerFill className="w-6 h-6" />
            </div>
            <p className="text-lg">
              Action Duration (<span>sec</span>)
            </p>
          </div>
          <input
            type="text"
            placeholder="Seconds ex: 1, 2, 3, 4"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md`}
            required
          />
        </div> */}

        <div className="mt-4">
          <div className="flex items-center justify-start mb-2">
            <div className="p-2 rounded-xl bg-base-300 mr-2">
              <GiProcessor className="w-6 h-6" />
            </div>
            <p className="text-lg">Event/AI/Caller</p>
          </div>
          <select
            placeholder="Choose AI that will handle this action"
            onChange={(e) => {
              setCaller(e.target.value);
            }}
            value={caller}
            className="select select-bordered w-full max-w-xs"
          >
            <option>Choose</option>
            <option>Heat Stress Detector</option>
            <option>Pig Detector</option>
            <option>Dark Scene Detector</option>
          </select>
        </div>

        {(caller === "Heat Stress Detector" || caller === "Pig Detector") && (
          <>
            <div className="divider"></div>
            <div className="md:flex justify-between items-center">
              <div className="mr-4">
                <div className="flex items-center justify-start mb-2">
                  <div className="p-2 rounded-xl bg-base-300 mr-2">
                    <FaHandSparkles className="w-6 h-6" />
                  </div>
                  <p className="text-lg">Force Activate</p>
                </div>
                <p className="text-xs md:text-sm">
                  Activates regardless of event location.
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle mt-4 md:mt-0"
                onChange={(e) => {
                  setForceActivate(e.target.checked);
                }}
                checked={forceActivate}
              />
            </div>
            {!forceActivate && (
              <div className="mt-4">
                <div className="flex items-center justify-start mb-2">
                  <div className="p-2 rounded-xl bg-base-300 mr-2">
                    <MdMyLocation className="w-6 h-6" />
                  </div>
                  <p className="text-lg"> Choose event location</p>
                </div>
                <div className="relative mt-4">
                  <div
                    className="w-full coverStretch bg-no-repeat h-80 bg-base-100"
                    style={{
                      //https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Road_in_Norway.jpg/1200px-Road_in_Norway.jpg
                      //http://${PI_IP}:8000/normal_feed
                      backgroundImage: `url("https://image.shutterstock.com/shutterstock/photos/1506244592/display_1500/stock-photo-top-view-of-three-little-black-and-white-pigs-standing-on-hay-in-a-cage-1506244592.jpg")`,
                    }}
                  ></div>
                  <div
                    className={`w-full h-full grid grid-cols-${divisionCount.col} grid-rows-${divisionCount.row} overflow-hidden overflow-x-scroll absolute top-0 left-0`}
                  >
                    {
                      // filter((e) => e !== data.value.eventLocation )
                      Array.from(
                        { length: divisionCount.col * divisionCount.row },
                        (_, i) => i + 1
                      ).map((e, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setEventLocation(e);
                          }}
                          className={`w-full p-4 outline outline-1 bg-base-100/70 hover:bg-base-100/95  outline-base-300 rounded-sm ${
                            eventLocation === e
                              ? "bg-base-300/90 outline-secondary shadow-md backdrop-blur-sm"
                              : ""
                          }`}
                        >
                          <p className="text-center text-sm">{e}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="modal-action">
          <label
            onClick={() => {
              close();
            }}
            className="btn"
          >
            Cancel
          </label>
          <button
            disabled={!canSave()}
            onClick={() => save(mode)}
            className={`btn ${loading ? "loading" : ""}`}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default actionComponent;
