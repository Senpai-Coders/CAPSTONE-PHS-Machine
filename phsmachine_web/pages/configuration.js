import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import Debug from "../components/configuration/debug";
import axios from "axios";

import PhsSettingsV2 from "../components/configuration/phsSettingsv2";

// import ThemeChooser from "../components/configuration/themeChooser";
// import { FcCheckmark } from "react-icons/fc";
// import { HiOutlineSelector } from "react-icons/hi";
// import { Listbox, Transition } from "@headlessui/react";

const configuration = () => {
  const [tab, setTab] = useState(0);
  const [exited, setExited] = useState(false);

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

  const [detectionMode, setDetectionMode] = useState({
    value: { mode: true, temperatureThreshold: -34 },
  });

  const [dbActions, setDbActions] = useState([]);

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
      // setACTIONSTATE(phs_actions.data.actions);
      SETSYSSTATE(phs_response.data.state);
      //setIsDown(false);
    } catch (e) {
      //setIsDown(true);
      SETSYSSTATE({ ...SYSSTATE, status: -2 });
    }
  };

  const init = async () => {
    try {
      if (exited) return;
      const db_actions = await axios.post("/api/phs/config/actions", {
        mode: 2,
      });

      const db_detMode = await axios.post("/api/phs/config/detectionMode", {
        mode: 0,
      });

      const phs_storage = await axios.post("/api/phs/phs_storage", {});

      setDetectionMode(db_detMode.data);

      setPhsStorage(phs_storage.data.storage);
      setDbActions(db_actions.data.actions);
      // setDbActiveUsers(db_active_users.data.activeUsers);
      // setPastDetection(db_past_detections.data.detections);
    } catch (e) {}
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
                } tab-lg tab tab-lifted tab-sm sm:tab-md md:tab-md `}
              >
                Settings
              </a>
              <a
                onClick={() => setTab(1)}
                className={`${
                  tab === 1 ? "tab-active" : ""
                } tab-lg tab tab-lifted tab-sm sm:tab-md md:tab-md `}
              >
                Actions
              </a>
              <a
                onClick={() => setTab(2)}
                className={`${
                  tab === 2 ? "tab-active" : ""
                } tab-lg tab tab-lifted tab-sm sm:tab-md md:tab-md `}
              >
                Relays
              </a>
            </div>
          </div>
          <div>
            {tab === 0 && (
              <PhsSettingsV2
                storageInfo={phsStorage}
                detectionMode={detectionMode}
                state={SYSSTATE.status}
              />
            )}
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
