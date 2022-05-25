import { useEffect, useState } from "react";
import { VscDebugConsole } from "react-icons/vsc";
import axios from "axios";
import { GoCircuitBoard } from "react-icons/go";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { RiZzzFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { CgDetailsLess } from "react-icons/cg";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaConnectdevelop } from "react-icons/fa";
import { API } from "../../helpers";
import { GiPowerLightning } from "react-icons/gi";

import CreateRelay from "../modalform/c_relay";

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
  const [ACTIONSTATE, setACTIONSTATE] = useState([]);

  const [isDown, setIsDown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [seenModal, setSeenModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState();

  const [modalRelay, setMoadlRelay] = useState(false);
  const [modalRelayView, setMoadlRelayView] = useState(false);
  const [loading, setLoading] = useState(false);

  const [] = useState(true);

  const init = async () => {
    try {
      const phs_response = await axios.get(
        "http://192.168.1.5:8000/getSystemState"
      );
      SETSYSSTATE(phs_response.data.state);
      const relays = await axios.get("http://192.168.1.5:8000/getAllRelays");
      const phs_actions = await axios.get(
        "http://192.168.1.5:8000/getActionState"
      );
      setACTIONSTATE(phs_actions.data.actions);
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
    const emitRes = axios.post("http://192.168.1.5:8000/emitRelay", {
      relay_name,
      state,
    });
  };

  const delRelay = async (config_name) => {
    try {
      setLoading(true);
      const emitRes = axios.post("http://192.168.1.5:8000/emitRelay", {
        relay_name : config_name,
        state : false,
      });
      const add = await API.post("/api/phs/config/relays", {
        mode: -1,
        config_name,
      });
      setLoading(false);
      setMoadlRelayView(false);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        //request was made but theres a response status code
        if (e.response.data.error === 409) setErr(e.response.data.message);
      }
    }
  };

  const canDelete = (config_name) => {
    for (var x = 0; x < ACTIONSTATE.length; x++) {
      var action = ACTIONSTATE[x];
      if (action.target_relay === config_name) return false;
    }
    return true;
  };

  useEffect(() => {
    let refreshData = setInterval(() => init(), 1000);
    return () => [clearInterval(refreshData)];
  }, []);

  return (
    <div className="mb-8">
      {/** MODALS */}
      <div
        htmlFor="sys_off_modal"
        className={`modal ${
          !seenModal && (SYSSTATE.status === -2 || isDown) ? "modal-open" : ""
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

      <input type="checkbox" id="new_relay_modal" className="modal-toggle" />
      <label
        className={`modal font-inter backdrop-blur-sm modal-bottom sm:modal-middle duration-200 ${
          modalRelay ? "modal-open" : ""
        }`}
      >
        <CreateRelay onClose={() => setMoadlRelay(false)} />
      </label>

      <input type="checkbox" id="relay_view" className="modal-toggle" />
      <div
        className={`modal font-inter backdrop-blur-sm modal-bottom sm:modal-middle duration-200 ${
          modalRelayView ? "modal-open" : ""
        }`}
      >
        <div className="modal-box">
          {selectedComponent && (
            <>
              
              <div className="mb-5 flex justify-between items-center">
                <h3 className="font-bold text-lg">
                  {selectedComponent.config_name}
                </h3>
                <div
                  className={`flex justify-between items-center ${
                    selectedComponent.state && !isDown
                      ? "text-accent animate-pulse"
                      : "text-primary"
                  }`}
                >
                  <p className="text-md font-bold">
                    {selectedComponent.state ? "On" : "Off"}
                  </p>
                  <GoCircuitBoard
                    className={`ml-4 w-8 h-8 duration-500 ${
                      selectedComponent.state ? "shadow-xl shadow-accent" : ""
                    }`}
                  />
                </div>
              </div>
              {selectedComponent.state && (
                <div className="alert shadow-lg">
                  <div>
                    <GiPowerLightning
                      className={`ml-4 w-4 h-4 duration-500 ${
                        selectedComponent.state
                          ? "text-warning"
                          : "text-primary"
                      }`}
                    />
                    <span>This component is on</span>
                  </div>
                </div>
              )}
              <div className="my-2 flex items-center">
                <CgDetailsLess className="w-8 h-8 mr-4" />
                <p className="">{selectedComponent.description}</p>
              </div>
              <div
                className={`my-2 flex items-center  ${
                  selectedComponent.state ? "text-accent " : ""
                }`}
              >
                <VscDebugDisconnect className={`w-8 h-8 mr-4`} />
                <p className={`font-bold`}>
                  GPIO: <span>{selectedComponent.GPIO_PIN}</span>
                </p>
              </div>
              <div
                className={`my-2 flex items-center font-bold ${
                  selectedComponent.state ? "text-accent " : ""
                }`}
              >
                <FaConnectdevelop
                  className={`w-8 h-8 mr-4 ${
                    selectedComponent.state ? "animate-spin-slow" : ""
                  }`}
                />
                <p className="">
                  {selectedComponent.used ? "In Use" : "Not Used"}
                </p>
              </div>
              {!canDelete(selectedComponent.config_name) && (
                <div className="alert shadow-lg">
                  <div>
                    <span>
                      This component is use by another action. To delete this,
                      delete the actions first.
                    </span>
                  </div>
                </div>
              )}
              <div className="modal-action">
                <button
                  onClick={() => {
                    setMoadlRelayView(false);
                  }}
                  className="btn"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    delRelay(selectedComponent.config_name);
                  }}
                  disabled={!canDelete(selectedComponent.config_name)}
                  className={`btn gap-2 btn-error ${loading ? "loading" : ""}`}
                >
                  <VscDebugDisconnect className="w-4 h-4 " />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="divider"></div>

      {/** ALERTS */}
      <div>
        <div className="alert text-warning shadow-lg">
          <div className={` ${SYSSTATE.status === 2 && "animate-pulse "}`}>
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
                  `http://192.168.1.5:8000/updateState?status=${
                    SYSSTATE.status === 2 ? 0 : 2
                  }`
                );
              }}
            />
          </div>
        </div>

        <div className="flex space-x-3 bg-none items-center mt-6">
          <BsFillExclamationSquareFill className={`text-accent w-4 h-4`} />
          <span>
            When debugging mode is on, The AI cannot call any of the action that
            are using these componenents. Also debugging mode will let you
            manually toggle these component.
          </span>
        </div>
      </div>

      <div className="divider"></div>
      <p className="text-lg">Components</p>

      <div className={` my-4 relative mb-6`}>
        {!loaded && (
          <progress className="progress progress-warning absolute top-0 left-0 w-full"></progress>
        )}

        <label onClick={() => setMoadlRelay(true)} className="mt-4 btn">
          New Relay <AiOutlinePlus className="ml-2 w-6 h-6" />
        </label>
        <div
          className={`grid min-h-16 pt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 duration-500`}
        >
          {relays.map((rel, i) => (
            <div
              onClick={() => {
                setSelectedComponent(rel);
                setMoadlRelayView(true);
              }}
              key={i}
              className={`p-2 rounded-lg bg-base-100/75 backdrop-blur-sm shadow-lg duration-700 ${
                rel.state ? "border-y-4 border-accent" : "border-y border-base"
              }`}
            >
              <div className="card-body">
                <div className="flex justify-between">
                  <h2 className="card-title">{rel.config_name}</h2>
                  <GoCircuitBoard
                    className={`w-8 h-8 duration-500 ${
                      rel.state && !isDown
                        ? "text-accent animate-pulse shadow-xl shadow-accent"
                        : "text-primary"
                    }`}
                  />
                </div>
                <p>{rel.description}</p>
                <div className="card-actions justify-evenly">
                  <p
                    className={`font-inter font-semibold ${
                      rel.state && !isDown ? "text-accent" : ""
                    }`}
                  >
                    {rel.state ? "ON" : "OFF"}
                  </p>
                  <input
                    disabled={SYSSTATE.status !== 2}
                    type="checkbox"
                    className={`toggle toggle-accent ${
                      SYSSTATE.status !== 2 ? "opacity-50" : "opacity-100"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      emitRelay(rel.config_name, !rel.state);
                    }}
                    checked={rel.state}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>
      <p className="text-lg">Actions</p>
      <label onClick={() => setMoadlRelay(true)} className="mt-4 btn">
        New Action <AiOutlinePlus className="ml-2 w-6 h-6" />
      </label>
    </div>
  );
};

export default debug;
