import { useState, useEffect } from "react";

import { AiFillEdit } from "react-icons/ai";
import { RiListSettingsLine, RiListSettingsFill } from "react-icons/ri";
import { MdMyLocation, MdClose } from "react-icons/md";
import { GiProcessor } from "react-icons/gi";
import { GoCircuitBoard } from "react-icons/go";
import { CgDetailsLess } from "react-icons/cg";
import { FaHandSparkles } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

import axios from "axios";
import { PI_IP } from "../../../helpers";

import { toast } from "react-toastify";

import { DeleteConfirm } from "../../modals/";

const actionComponent = ({
  relayOptions,
  data,
  onSave,
  divisionCount,
  fireOnChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [toDelete, setToDelete] = useState();

  const [config_name, setConfig_name] = useState("");
  const [description, setDescription] = useState("");

  const [caller, setCaller] = useState("");

  const [targets, setTargets] = useState([]);
  const [eventLocation, setEventLocation] = useState(-1);
  const [forceActivate, setForceActivate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState(2);

  const [modalActionView, setMoadlActionView] = useState(-1);

  const set = (d) => {
    setConfig_name(d.config_name);
    setDescription(d.description);

    setTargets(d.value.targets);

    setCaller(d.value.caller);
    setEventLocation(d.value.eventLocation);
    setForceActivate(d.value.forceActivate);
  };

  useEffect(() => {
    set(data);
  }, []);

  const save = async (md) => {
    let toast_id = toast.loading("Saving changes lol", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    try {
      setLoading(true);
      onSave(true);
      const add = await axios.post("/api/phs/config/actions", {
        mode: md,
        description,
        config_name,
        value: {
          targets,
          caller,
          forceActivate,
          eventLocation,
        },
        _id: data._id,
      });
      toast.update(toast_id, {
        render: "Successfuly saved",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      fireOnChange();
      setLoading(false);
      setEditing(false);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.status === 409) setErr(e.response.data.message);
      }
      toast.update(toast_id, {
        render: "Failed saving changes",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  const updateSpecificTarget = (idx, mode, relay, duration) => {
    let copyTargets = [...targets];
    if (mode) copyTargets[idx].target_relay = relay;
    else copyTargets[idx].duration = duration;
    setTargets([...copyTargets]);
  };

  const canSave = () => {
    if (config_name.length === 0) return false;
    if (description.length === 0) return false;
    if (caller.length === 0) return false;
    if (targets.length === 0) return false;
    if (caller === "Choose") return false;

    if (caller !== "Dark Scene Detector" && !forceActivate) {
      if (eventLocation === -1) return false;
    }

    return true;
  };

  const delAction = async (config_name, target_relay) => {
    let toast_id = toast.loading("Deleting lol", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    try {
      setLoading(true);
      onSave(true);
      const add = await axios.post("/api/phs/config/actions", {
        mode: -1,
        config_name,
        target_relay,
      });
      toast.update(toast_id, {
        render: "Successfuly deleted",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      setLoading(false);
      setMoadlActionView(-1);
      fireOnChange();
      onSave(false);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.data.error === 409) setErr(e.response.data.message);
      }
      console.log(e);
      toast.update(toast_id, {
        render: "Failed to remove",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  return (
    <>
      <div
        className={`shadow-md py-4 outline outline-1 ${
          editing ? "outline-accent-focus" : "outline-base-300"
        } bg-base-100 rounded-md my-2 px-3 md:px-4`}
      >
        <DeleteConfirm
          deleteWhat={"Action"}
          onAccept={() => {
            delAction(toDelete.config_name, toDelete.value.target_relay);
          }}
          close={setMoadlActionView}
          shown={modalActionView !== -1}
        />
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
                <p className="text-lg">Target Relays</p>
              </div>
              <div className="overflow-y-scroll h-56">
                <table className="table table-compact table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Target Relay</th>
                      <th>Duration (seconds)</th>
                      <th>
                        <div
                          className="tooltip text-sm"
                          data-tip="Add New Target"
                        >
                          <button
                            onClick={() =>
                              setTargets([
                                ...targets,
                                { target_relay: 4, duration: 1 },
                              ])
                            }
                            className="mt-2 btn-square btn btn-sm"
                          >
                            <AiOutlinePlus className="text-2xl" />
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {targets.map((i, idx) => (
                      <tr className="">
                        <td>
                          <div className="dropdown w-full">
                            <label
                              tabIndex="0"
                              className="btn font-mono btn-sm w-full"
                            >
                              <GoCircuitBoard className={`text-sm mr-2`} />
                              {i.target_relay}
                            </label>
                            <ul
                              tabIndex="0"
                              className="dropdown-content menu max-h-56 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 border-b border-l border-r border-base-300 rounded-sm"
                            >
                              {relayOptions.map((rel, id) => (
                                <li
                                  tabIndex={i + 1}
                                  key={id}
                                  onClick={() =>
                                    updateSpecificTarget(idx, true, rel.config_name)
                                  }
                                  className={`cursor-pointer duration-100 m-1 snap-center ${
                                    i.target_relay === rel.config_name
                                      ? "bg-base-200 outline outline-1"
                                      : ""
                                  }`}
                                >
                                  <div className="flex p-4 justify-between">
                                    <p className="text-md">{rel.config_name}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            onChange={(e) => {
                              let val = e.target.value;

                              if (isNaN(Number.parseInt(val))) return;

                              val = Number.parseInt(val);
                              if (val <= 0) return;
                              updateSpecificTarget(
                                idx,
                                false,
                                i.target_relay,
                                val
                              );
                            }}
                            placeholder="Enter Duration"
                            value={i.duration}
                            className="input input-sm bg-base-100/50 w-full text-sm font-mono "
                          />
                        </td>
                        <td>
                          <div className="tooltip" data-tip="Remove Target">
                            <button
                              className="btn btn-square btn-sm text-lg"
                              onClick={() => {
                                let targs = [...targets];
                                targs.splice(idx, 1);
                                setTargets(targs);
                              }}
                            >
                              <MdClose className="" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

            {(caller === "Heat Stress Detector" ||
              caller === "Pig Detector") && (
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
                          backgroundImage: `url("http://${PI_IP}:8000/normal_feed")`,
                        }}
                      ></div>
                      <div
                        className={`w-full h-full grid grid-cols-${divisionCount.col} grid-rows-${divisionCount.row} overflow-hidden overflow-x-scroll absolute top-0 left-0`}
                      >
                        {Array.from(
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
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {!data.deletable && (
              <div className="alert shadow-lg my-4">
                <p className="text-center">
                  This Action is built in and cannot be deleted
                </p>
              </div>
            )}
            <div className="modal-action">
              {data.deletable && (
                <label
                  onClick={() => {
                    setLoading(false);
                    setToDelete(data);
                    setMoadlActionView(0);
                  }}
                  className="btn"
                >
                  Delete
                </label>
              )}
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
                  setMode(2);
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
