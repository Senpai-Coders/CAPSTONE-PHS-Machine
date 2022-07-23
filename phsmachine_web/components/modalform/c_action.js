import { API } from "../../helpers";
import { useState } from "react";
import { GoCircuitBoard } from "react-icons/go";
import { BsFillSaveFill } from "react-icons/bs";

const c_action = ({ onClose, components }) => {
  const [config_name, setConfig_name] = useState("");
  const [description, setDescription] = useState("");
  const [target_relay, setTargetRelay] = useState("");
  const [duration, setDuration] = useState(0);
  const [caller, setCaller] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    try {
      setLoading(true);
      if (target_relay.length === 0 || target_relay === "") {
        alert("no selected relay");
        setLoading(false);
        return;
      }
      const add = await API.post("/api/phs/config/actions", {
        mode: 0,
        config_name,
        description,
        target_relay,
        duration,
        caller,
      });
      setLoading(false);
      onClose();
    } catch (e) {
      setLoading(false);
      console.log(e.response.data.message);
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

  return (
    <label className="modal-box w-full md:w-11/12" htmlFor="">
      <div className="flex items-center justify-between my-4">
        <h3 className="font-bold text-lg">New Action</h3>{" "}
        <GoCircuitBoard className="w-6 h-6" />
      </div>
      <div className="mt-2">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Action Name
          </label>
          <input
            type="text"
            placeholder="ex: Fan, Pump, LED Light"
            value={config_name}
            onChange={(e) => {
              setErr("");
              setConfig_name(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md ${
              err === "username" ? "input-error" : ""
            }`}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Description
          </label>
          <input
            type="text"
            placeholder="Short Description"
            value={description}
            onChange={(e) => {
              setErr("");
              setDescription(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md ${
              err === "username" ? "input-error" : ""
            }`}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Duration
          </label>
          <input
            type="text"
            placeholder="Seconds ex: 1, 2, 3, 4"
            value={duration}
            onChange={(e) => {
              setErr("");
              setDuration(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md`}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Target
          </label>
          <select
            placeholder="Choose AI that will handle this action"
            onChange={(e) => {
              setTargetRelay(e.target.value);
            }}
            className="select select-bordered w-full max-w-xs"
          >
            <option>Select Target Relay</option>
            {components
              .filter((rel, i) => !rel.used)
              .map((rel, i) => (
                <option key={i}>{rel.config_name}</option>
              ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Event/AI/Caller
          </label>
          <select
            placeholder="Choose AI that will handle this action"
            onChange={(e) => {
              setCaller(e.target.value);
            }}
            className="select select-bordered w-full max-w-xs"
          >
            <option>Choose</option>
            <option>Heat Stress Detector</option>
            <option>Pig Detector</option>
            <option>Dark Scene Detector</option>
          </select>
        </div>
        <p className="text-center text-error font-inter text-sm">{err}</p>
      </div>

      <div className="modal-action">
        <label
          onClick={() => {
            setLoading(false);
            onClose();
          }}
          className="btn"
        >
          Cancel
        </label>
        <button
          disabled={!canSave()}
          onClick={() => save()}
          className={`btn ${loading ? "loading" : ""}`}
        >
          Save <BsFillSaveFill className="ml-3 w-4 h-4" />
        </button>
      </div>
    </label>
  );
};

export default c_action;
