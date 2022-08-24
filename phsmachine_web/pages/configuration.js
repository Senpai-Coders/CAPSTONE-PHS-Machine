import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import axios from "axios";
import Loader from "../components/loading"

import PhsSettingsV2 from "../components/configuration/phsSettingsv2";
import Actions from "../components/configuration/actions"
import Relays from "../components/configuration/relays"

// import ThemeChooser from "../components/configuration/themeChooser";
// import { FcCheckmark } from "react-icons/fc";
// import { HiOutlineSelector } from "react-icons/hi";
// import { Listbox, Transition } from "@headlessui/react";

const configuration = () => {
  const [tab, setTab] = useState(0);
  const [exited, setExited] = useState(false);

  const [loadA, setLoadA] = useState(false)
  const [loadB, setLoadB] = useState(false)

  const [SYSSTATE, SETSYSSTATE] = useState({
    status: 3, // -2 Off, -1 Disabled, 0 - Detecting, 1 - Resolving, 2 - Debugging, 3 - Connecting
    active_actions: "None",
    pig_count: 0,
    stressed_pigcount: 0,
    max_temp: "-",
    average_temp: "-",
    min_temp: "-",
    actions: [],
  });
  const [phsStorage, setPhsStorage] = useState({
    diskPath: "/",
    free: 0,
    size: 0,
  });

  const [coreActions, setCoreActions] = useState([])
  const [phsAutoDelete, setPhsAutoDelete] = useState({ value : false })
  const [phsDivision, setDivision] = useState({ value : { col : 1, row : 1} })
  const [detectionMode, setDetectionMode] = useState({
    value: { mode: true, temperatureThreshold: -34 },
  });

  const [dbActions, setDbActions] = useState([]);
  const [dbRelays, setDbRelays] = useState([])

  const phs_init = async () => {
    try {
      if (exited) return;
      const phs_response = await axios.get(
        `http://${PI_IP}:8000/getSystemState`,
        {}
      );
      const phs_actions = await axios.get(
        `http://${PI_IP}:8000/getActionState`,
        {}
      );
      if (exited) return;
      setCoreActions(phs_actions.data.actions);
      SETSYSSTATE(phs_response.data.state);
      //setIsDown(false);
      setLoadA(true)
    } catch (e) {
      //setIsDown(true);
      SETSYSSTATE({ ...SYSSTATE, status: -2 });
      setLoadA(true)
    }
  };

  const init = async () => {
    try {
      if (exited) return;
      const db_actions = await axios.post("/api/phs/config/actions", {
        mode: 0,
      });

      const db_detMode = await axios.post("/api/phs/config/detectionMode", {
        mode: 0,
      });

      const phs_storage = await axios.post("/api/phs/phs_storage", {});

      const phs_autodelete = await axios.post("/api/phs/config/storageAutoDelete", {
        mode : 0
      })

      const phs_relays = await axios.post("/api/phs/config/relays", {
        mode : 3
      })

      const ph_division = await axios.post("/api/phs/config/divisions", {
        mode : 0
      })

      setDivision(ph_division.data.value)
      setDbRelays(phs_relays.data)
      setDetectionMode(db_detMode.data);
      setPhsAutoDelete(phs_autodelete.data);
      setPhsStorage(phs_storage.data.storage);
      setDbActions(db_actions.data.actions);
      // setDbActiveUsers(db_active_users.data.activeUsers);
      // setPastDetection(db_past_detections.data.detections);
      setLoadB(true)
    } catch (e) { 
      setLoadA(true)
    }
  };

  useEffect(() => {
    var loader = setInterval(async () => {
      if (exited) return;
      phs_init();
      init();
    }, 2000);

    return () => {
      clearInterval(loader);
      setExited(true);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Configuration</title>
      </Head>
      <input type="checkbox" id="sys_off_modal" className="modal-toggle" />
      <div className="flex justify-center">
        <div className="w-full mx-0 md:mx-4 md:w-1/2">
          <p className="text-2xl card-title font-lato font-semibold">
            {/* Configuration */}
          </p>
          <div className="my-2 ">
            <div className="tabs">
              <a
                onClick={() => setTab(0)}
                className={`${
                  tab === 0 ? "tab-active" : ""
                } tab tab-lifted`}
              >
                Settings
              </a>
              <a
                onClick={() => setTab(1)}
                className={`${
                  tab === 1 ? "tab-active" : ""
                } tab tab-lifted`}
              >
                Actions
              </a>
              <a
                onClick={() => setTab(2)}
                className={`${
                  tab === 2 ? "tab-active" : ""
                } tab tab-lifted`}
              >
                Relays
              </a>
            </div>
          </div>
          <div>

            { !loadA || !loadB && <Loader /> }
            
            {tab === 0 && loadA && loadB && (
              <PhsSettingsV2
                divisionCount={phsDivision}
                autoDelete={phsAutoDelete}
                storageInfo={phsStorage}
                detectionMode={detectionMode}
                state={SYSSTATE.status}
              />
            )}
            {
                tab === 1 && loadA && loadB &&  (
                    <Actions divisionCount={phsDivision} actions={dbActions} relays={dbRelays} coreActions={coreActions}/>
                )
            }
            {
                tab === 2 &&  loadA && loadB && (
                    <Relays/>
                )
            }
            {/* <Debug /> */}
            {/* <ThemeChooser /> */}
          </div>
        </div>
      </div>
    </>
  );
};

configuration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default configuration;
