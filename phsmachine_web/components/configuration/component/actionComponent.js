import { useState, useEffect } from "react";

import { AiFillEdit } from "react-icons/ai";
import {
  RiListSettingsLine,
  RiListSettingsFill,
  RiTimerFill,
} from "react-icons/ri";
import { MdMyLocation } from "react-icons/md";
import { GiProcessor } from "react-icons/gi";
import { GoCircuitBoard } from "react-icons/go";
import { CgDetailsLess } from "react-icons/cg";

import axios from "axios";

const actionComponent = ({ relayOptions, data, onSave, divisionCount }) => {
  const [editing, setEditing] = useState(false);

  const [config_name, setConfig_name] = useState("");
  const [description, setDescription] = useState("");
  const [target_relay, setTargetRelay] = useState("");
  const [duration, setDuration] = useState(0);
  const [caller, setCaller] = useState("");
  const [eventLocation, setEventLocation] = useState(-1);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState(1);

  const set = (d) => {
    setConfig_name(d.config_name);
    setDescription(d.description);
    setTargetRelay(d.value.target_relay);
    setDuration(d.value.duration);
    setCaller(d.value.caller);
    setEventLocation(d.value.eventLocation);
  };

  useEffect(() => {
    set(data);
  }, []);

  const save = async (md) => {
    try {
      setLoading(true);
      onSave(true);
      if (
        target_relay.length === 0 ||
        target_relay === "" ||
        target_relay === "Select Target Relay"
      ) {
        alert("no selected relay");
        setLoading(false);
        return;
      }

      let saving = {
        mode: md,
        description,
        target_relay,
        duration,
        old_target_relay: data.value.target_relay,
        caller,
        eventLocation,
      };
      console.log("saving mode: ", md);
      if (md === 1) {
        if (config_name !== data.config_name)
          saving = {
            ...saving,
            old_config_name: data.config_name,
            config_name,
          };
        else saving = { ...saving, old_config_name: data.config_name };
      }
      const add = await axios.post("/api/phs/config/actions", saving);
      setLoading(false);
      setEditing(false);
    } catch (e) {
      setLoading(false);
      //console.log(e.response.data.message);
      if (e.response) {
        //request was made but theres a response status code
        if (e.response.status === 409) setErr(e.response.data.message);
      }
    }
  };

  const canSave = () => {
    if (config_name.length === 0) return false;
    if (description.length === 0) return false;
    if (duration.length === 0 || isNaN(parseInt(duration))) return false;
    if (caller.length === 0) return false;
    return true;
  };

  const delAction = async (config_name, target_relay) => {
    try {
      setLoading(true);
      onSave(true);
      const add = await axios.post("/api/phs/config/actions", {
        mode: -1,
        config_name,
        target_relay,
      });
      setLoading(false);
      setMoadlActionView(false);
      onSave(false);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        //request was made but theres a response status code
        if (e.response.data.error === 409) setErr(e.response.data.message);
      }
    }
  };

  return (
    <>
      <div
        className={`shadow-md py-4 outline outline-1 ${
          editing ? "outline-accent-focus" : "outline-base-300"
        } bg-base-100 rounded-md my-2 px-3 md:px-4`}
      >
        {editing ? (
          <>
            <div className="flex items-center justify-between">
              <div className="form-control">
                <div className="flex items-center justify-start mb-2">
                  <div className="p-2 rounded-xl bg-base-300 mr-2">
                    <RiListSettingsFill className="w-6 h-6" />
                  </div>
                  <p className="text-lg">Action Name</p>
                </div>
                <label className="input-group">
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
                  {/* <span
                  className="cursor-pointer "
                  onClick={() => { }}
                >
                  <div
                    className="tooltip tracking-wide"
                    data-tip="show/hide password"
                  >

                  </div>
                </span> */}
                </label>
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
            </div>

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

            {/* <div className="mb-6">
              <label className="block mb-2 text-sm ">Event Location</label>
              <select
                placeholder="Choose AI that will handle this action"
                onChange={(e) => {
                  setEventLocation(e.target.value);
                }}
                value={eventLocation}
                className="select select-bordered w-full max-w-xs"
              >
                <option>Choose</option>
                {
                  // filter((e) => e !== data.value.eventLocation )
                  Array.from({ length: divisionCount }, (_, i) => i + 1).map(
                    (e, idx) => (
                      <option key={idx}>{e}</option>
                    )
                  )
                }
              </select>
            </div> */}

            {(caller === "Heat Stress Detector" ||
              caller === "Pig Detector") && (
              <>
                <div className="divider"></div>
                <div className="mt-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <MdMyLocation className="w-6 h-6" />
                    </div>
                    <p className="text-lg"> Choose event location</p>
                  </div>
                  <div className="relative mt-4">
                    <div className="w-full h-64 bg-base-100"></div>
                    <div className="w-full h-full py-2 flex overflow-hidden overflow-x-scroll absolute bottom-0 left-0">
                      {
                        // filter((e) => e !== data.value.eventLocation )
                        Array.from(
                          { length: divisionCount },
                          (_, i) => i + 1
                        ).map((e, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setEventLocation(e);
                            }}
                            className={`w-full mx-2 p-4 outline outline-1 ${
                              eventLocation === e
                                ? "bg-base-300 outline-secondary shadow-md"
                                : "bg-base-100"
                            } outline-base-300 rounded-sm`}
                          >
                            <p className="text-center text-sm">Division {e}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="modal-action">
              <label
                onClick={() => {
                  setLoading(false);
                  delAction(data.config_name, data.value.target_relay);
                  setEditing();
                }}
                className="btn"
              >
                Delete
              </label>
              <label
                onClick={() => {
                  setLoading(false);
                  set(data);
                  setEditing();
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
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center">
                <RiListSettingsLine className="w-6 h-6 mr-2" />
                <p className="text-lg font-inter">{data.config_name}</p>
              </div>
              <button
                className="btn btn-square btn-ghost"
                onClick={() => {
                  setMode(1);
                  setEditing(!editing);
                }}
              >
                <AiFillEdit className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default actionComponent;
