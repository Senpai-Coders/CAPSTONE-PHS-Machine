import { useEffect, useState } from "react";
import { VscDebugConsole } from "react-icons/vsc";
import axios from "axios";
import { GoCircuitBoard } from "react-icons/go";
import { BsFillExclamationSquareFill } from "react-icons/bs"
import { RiZzzFill } from "react-icons/ri";

const debug = ({ STAT }) => {
  const [relays, setRelays] = useState([]);
  const [SYSSTATE, SETSYSSTATE] = useState({
    status: 3, // -2 Off, -1 Disabled, 0 - Detecting, 1 - Resolving, 2 - Debugging, 3 - Connecting
    active_actions: "None",
    lighting: "Off",
    pig_count: 0,
    stressed_pigcount: 0,
    max_temp: "-",
    average_temp: "-",
    min_temp: "-",
  });

  const [isDown, setIsDown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [seenModal, setSeenModal] = useState(false);

  const init = async () => {
    try {
      const phs_response = await axios.get(
        "http://192.168.1.6:8000/getSystemState"
      );
      SETSYSSTATE(phs_response.data.state);
      const relays = await axios.get("http://192.168.1.6:8000/getAllRelays");
      setRelays(relays.data);
      setLoaded(true);
      setIsDown(false);
    } catch (e) {
      setIsDown(true);
      SETSYSSTATE({ ...SYSSTATE, status: -2 });
    }
  };

  const emitRelay = (relay_name, state) => {
    setLoaded(false);
    const emitRes = axios.post("http://192.168.1.6:8000/emitRelay", {
      relay_name,
      state,
    });
  };

  useEffect(() => {
    let refreshData = setInterval(() => init(), 1000);
    return () => [clearInterval(refreshData)];
  }, []);

  return (
    <div className="mb-8">
      <div
        htmlFor="sys_off_modal"
        className={`modal ${
          !seenModal && ( SYSSTATE.status === -2 || isDown ) ? "modal-open" : ""
        } font-inter backdrop-blur-sm modal-bottom sm:modal-middle duration-200`}
      >
        <div className="modal-box">
          <div className="flex space-x-4">
            <RiZzzFill className=" w-9 h-9" />
            <h3 className="font-bold text-lg">PHS Detection System Is Off</h3>
          </div>
          <p className="py-4">
            The system cannot analyze pig & you cannot change some of the
            configurations
          </p>
          <div className="modal-action">
            <button
              onClick={() => {
                setSeenModal(true);
                console.log(true, seenModal);
              }}
              className="btn"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
      <div className="divider"></div>

      {/** ALERTS */}
      <div>
        <div className="alert text-warning shadow-lg">
          <div className={` ${SYSSTATE.status === 2 && "animate-pulse"}`}>
            <VscDebugConsole className={`w-7 h-7`} />
            <span>
              Debugging mode. Use to test or verify if components working
              properly.
            </span>
          </div>
          <div className="flex-none">
            <p>{SYSSTATE.status === 2 ? "Enabled" : "Disabled"}</p>
            <input
              type="checkbox"
              disabled={isDown}
              className="toggle toggle-primary"
              checked={SYSSTATE.status === 2}
              onChange={(e) => {
                axios.get(
                  `http://192.168.1.6:8000/updateState?status=${
                    SYSSTATE.status === 2 ? 0 : 2
                  }`
                );
              }}
            />
          </div>
        </div>

        <div class="flex space-x-3 bg-none items-center mt-6">
            <BsFillExclamationSquareFill className={`text-accent w-4 h-4`}/>
            <span>When debugging mode is on, Tha AI cannot call any of the action that are using these componenents</span>
        </div>
      </div>

      <div
        className={`${
          SYSSTATE.status !== 2 ? "opacity-50" : "opacity-100"
        } duration-500 my-4 relative`}
      >
        {!loaded && (
          <progress className="progress progress-warning absolute top-0 left-0 w-full"></progress>
        )}
        <div className="grid min-h-16 pt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relays.map((rel, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg bg-base-100/75 backdrop-blur-sm shadow-lg duration-700 ${
                rel.state ? "border-y border-accent" : "border-y border-base"
              }`}
            >
              <div className="card-body">
                <div className="flex justify-between">
                  <h2 className="card-title">{rel.config_name}</h2>
                  <GoCircuitBoard
                    className={`w-8 h-8 duration-500 ${
                      rel.state && !isDown ? "text-accent animate-pulse" : "text-primary"
                    }`}
                  />
                </div>
                <p>{rel.description}</p>
                <div className="card-actions justify-end">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text"></span>
                      <input
                        disabled={SYSSTATE.status !== 2}
                        type="checkbox"
                        className="toggle toggle-accent"
                        onChange={() => {
                          emitRelay(rel.config_name, !rel.state);
                        }}
                        checked={rel.state}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default debug;
