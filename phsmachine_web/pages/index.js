import { RiZzzFill } from "react-icons/ri";
import { AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";

import Layout from "../components/layout";
import Cameras from "../components/layout_camera";
import SystemState from "../components/systemState";
import Head from "next/head";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [SYSSTATE, SETSYSSTATE] = useState({
    status: 3, // -2 Off, -1 Disabled, 0 - Detecting, 1 - Resolving, 2 - Debugging, 3 - Connecting
    active_actions: "None",
    lighting: "Off",
    pig_count: 0,
    stressed_pigcount: 0,
    max_temp: "-",
    average_temp: "-",
    min_temp: "-",
    actions: []
  });

  const [ACTIONSTATE, setACTIONSTATE] = useState([])

  const [isDown, setIsDown] = useState(false);
  const [seenModal, setSeenModal] = useState(false);

  const init = async () => {
    try {
      const phs_response = await axios.get(
        "http://192.168.1.5:8000/getSystemState"
      );
      const phs_actions = await axios.get("http://192.168.1.5:8000/getActionState")
      setACTIONSTATE(phs_actions.data.actions)
      SETSYSSTATE(phs_response.data.state);
      setIsDown(false);
    } catch (e) {
      setIsDown(true);
      SETSYSSTATE({ ...SYSSTATE, status: -2 });
    }
  };

  useEffect(() => {
    let refreshData = setInterval(() => init(), 1000);
    return () => [clearInterval(refreshData)];
  }, []);

  return (
    <>
      <Head>
        <title>System State</title>
      </Head>
      <input type="checkbox" id="sys_off_modal" className="modal-toggle" />
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
      <h1 className="text-xl card-title font-lato font-semibold mb-2">
        Detection
      </h1>
      <SystemState ACTIONSTATE={ACTIONSTATE} SYSSTATE={SYSSTATE} />
      <div className="mt-8 space-y-2">
        <AnimatePresence>
          {(isDown || SYSSTATE.status <= -1) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              exit={{ opacity: 0 }}
              className="alert alert-error shadow-lg"
            >
              <div>
                <RiZzzFill className="w-6 h-6 animate-pulse" />
                <span>
                  {SYSSTATE.status === -2
                    ? "PHS Detection System is currently off..."
                    : "PHS Detection System is disabled, you can re-enable it on settings."}
                </span>
              </div>
            </motion.div>
          )}
          {SYSSTATE.status === -1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              exit={{ opacity: 0 }}
              className="alert shadow-lg"
            >
              <div>
                <AiOutlineInfoCircle className="w-6 h-6" />
                <span>
                  The AI & Actions are disabled. But the system can still stream
                  realtime images
                </span>
              </div>
            </motion.div>
          )}
          {SYSSTATE.status === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              exit={{ opacity: 0 }}
              className="alert alert-warning shadow-lg"
            >
              <div>
                <AiOutlineWarning className="w-6 h-6 animate-pulse" />
                <span>
                  PHS System is in Debugging mode. System Actions are disabled
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="divider my-8">Realtime View</div>
      <Cameras canStream={isDown || SYSSTATE.status === -2} />
      
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
