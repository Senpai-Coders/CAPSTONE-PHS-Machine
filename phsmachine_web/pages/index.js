import Layout from "../components/layout";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";

const Stream_Triple = dynamic(() => import("../components/Stream/triple"), {
  suspense: true,
});
const Stream_Dual = dynamic(() => import("../components/Stream/dual"), {
  suspense: true,
});
const Stream_Merge = dynamic(() => import("../components/Stream/merge"), {
  suspense: true,
});

import Head from "next/head";
import axios from "axios";

import {
  OffAlert,
  RebootConfirm,
  ShutdownConfirm,
} from "../components/modals/";

import { PI_IP, getCamMode, setCamMode, localErrorAdd, localErrorDeleteAll } from "../helpers";

import { GiPig } from "react-icons/gi";
import { BsHash } from "react-icons/bs";
import { CgUnavailable } from "react-icons/cg";

import {
  StreamLayoutBlock,
  SystemStateBlock,
  ActiveUserBlock,
  ThermalReadingBlock,
  ActionBlock,
  QuickControlsBlock,
  PhsStorageBlock,
  PastDetectionBlock,
} from "../components/Blocks";
import Loader from "../components/loading";

export default function Home() {
  const router = useRouter();

  axios.defaults.timeout = 4 * 1000;

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

  const [timeOutCount, setTimeOutCount] = useState(0);

  const [exited, setExited] = useState(false);
  const [stamp, setStamp] = useState(0);

  const [isDown, setIsDown] = useState(false);
  const [seenModal, setSeenModal] = useState(false);
  const [dbPastDetection, setPastDetection] = useState([]);

  const [viewMode, setViewMode] = useState(-1); // 0 - 3iple, 1 - dual (1 with dropdown option select), 2 - Merged Normal & Thermal
  const [selectedModal, setSelectedModal] = useState(-1); // -1 off or no shown modal by default
  // -1 off modal
  // -2 shutdown confirm
  // -3 Reboot Confirm

  const [phsStorage, setPhsStorage] = useState({
    diskPath: "/",
    free: 0,
    size: 0,
  });
  const [dbActions, setDbActions] = useState([]);
  const [dbActiveUsers, setDbActiveUsers] = useState([]);
  const [phsActions, setPhsActions] = useState([
    {
      config_name: "Mist",
      description: "This will activate the pump",
      target_relay: "Pump",
      duration: "5",
      state: false,
      elapsed: 25,
      caller: "Heat Stress Detector",
    },
    {
      config_name: "Fan",
      description: "Starting Div 1 LED",
      target_relay: "LED 1",
      duration: "30",
      state: true,
      elapsed: 27,
      caller: "Dark Scene Detector",
    },
  ]);

  const phs_core_init = async () => {
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
      setPhsActions(phs_actions.data.actions);
      SETSYSSTATE(phs_response.data.state);
      setIsDown(false);
      setTimeOutCount(0);
      localErrorDeleteAll()
    } catch (e) {
      setIsDown(true);
      setTimeOutCount(timeOutCount + 1);
      SETSYSSTATE({ ...SYSSTATE, status: -2 });
      if ((e.message == "Network Error"))
        localErrorAdd({
          notification_type: "error",
          title: "PHS Core Error",
          message:
            "PHS Core is not responding or possible not running, try restarting phs. Read description about error code on manual",
          additional: {
            error_code: 0,
            severity: "high",
            error_log: `${e.message}`,
          },
          priority: 0,
          links: [
            {
              link: "http://localhost:3001/",
              link_mode: false,
              link_short: "/",
            },
          ],
          seenBy: [],
          date: new Date(),
        });
    }
  };

  const init = async () => {
    try {
      if (exited) return;
      const db_actions = await axios.post("/api/phs/config/actions", {
        mode: 0,
      });
      const db_active_users = await axios.post("/api/phs/activeUsers", {});
      const db_past_detections = await axios.post("/api/phs/detection", {
        mode: 3,
      });

      const phs_storage = await axios.post("/api/phs/phs_storage", {});
      setPhsStorage(phs_storage.data.storage);
      setDbActions(db_actions.data.actions);
      setDbActiveUsers(db_active_users.data.activeUsers);
      setPastDetection(db_past_detections.data.detections);
      localErrorDeleteAll()
    } catch (e) {
      if ((e.message == "Network Error"))
        localErrorAdd({
          notification_type: "error",
          title: "PHS Web Server Error",
          message:
            "PHS Web Server is not responding or possible not running, try restarting phs. Read description about error code on manual",
          additional: {
            error_code: 1,
            severity: "high",
            error_log: `${e.message}`,
          },
          priority: 0,
          links: [
            {
              link: "http://localhost:3001/",
              link_mode: false,
              link_short: "/",
            },
          ],
          seenBy: [],
          date: new Date(),
        });
    }
  };

  useEffect(() => {
    let stmp = new Date().getTime();

    var loader = setInterval(async () => {
      if (exited) return;
      setStamp(stmp);
      phs_core_init();
      init();
    }, 2000);

    return () => {
      clearInterval(loader);
      console.log("unmounted stmp ", stmp);
      setExited(true);
    };
  }, []);

  useEffect(() => {
    if (viewMode === -1) return;
    setCamMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    let chosen = getCamMode();
    setViewMode(Number.parseInt(chosen));
  }, []);

  return (
    <>
      <Head>
        <title>Monitor</title>
      </Head>

      {/** MODALS */}
      <OffAlert
        shown={isDown && timeOutCount >= 3 && !seenModal}
        close={() => {
          setSelectedModal(-1);
          setSeenModal(true);
        }}
      />

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

      {/** MAIN CONTAINER */}
      <div className=" relative min-h-screen">
        {/** MONITORING STREAM STATUS */}
        {SYSSTATE.status === 3 && <Loader />}

        {SYSSTATE.status === -2 && (
          <div className="h-24 items-center justify-center flex">
            <CgUnavailable className="h-5 w-5 mr-2" />
            <p className="">Sorry, Stream Unavailable</p>
          </div>
        )}

        {/** MONITORING LAYOUT */}
        {!isDown && SYSSTATE.status !== 3 && (
          <div className="relative pb-4">
            {/* layout 0 - tripple */}
            {viewMode === 0 && (
              <Suspense fallback={`Loading...`}>
                <Stream_Triple />
              </Suspense>
            )}

            {/* layout 1 - dual */}
            {viewMode === 1 && (
              <Suspense fallback={`Loading...`}>
                <Stream_Dual />
              </Suspense>
            )}

            {/* layout 2 - merged */}
            {viewMode === 2 && (
              <Suspense fallback={`Loading...`}>
                <Stream_Merge />
              </Suspense>
            )}
          </div>
        )}

        {/** STATUS LAYOUT */}
        <div className="mt-4">
          <div className="flex flex-col flex-wrap sm:flex-row ">
            {/** COL 1 */}
            <div className="w-full sm:w-1/2 xl:w-1/5">
              {/** SYSTATE BLOCK */}
              <SystemStateBlock SYSSTATE={SYSSTATE} />

              {/** THERMAL READING BLOCK */}
              <ThermalReadingBlock SYSSTATE={SYSSTATE} />

              {/** Server Storage Status */}
              <PhsStorageBlock storageInfo={phsStorage} />
            </div>

            {/** COL 2 */}
            <div className="w-full sm:w-1/2 xl:w-1/5">
              {/** REALTIME PIG DETECT Count BLOCK */}
              <div className="mb-4 mx-0 sm:ml-4 xl:mr-4">
                <div className="shadow-lg rounded-2xl card bg-base-100 w-full">
                  <div className="p-4 flex items-center justify-start">
                    <GiPig className="w-7 h-7 text-pink-200" />
                    <p className="ml-2 font-bold text-md">
                      {SYSSTATE.pig_count} Pig On Frame
                    </p>
                  </div>
                  <div className="mx-4 mb-4 flex justify-between itms-center">
                    <p className="text-success">
                      {SYSSTATE.pig_count - SYSSTATE.stressed_pigcount} Normal
                    </p>
                    <p className="text-error">
                      {" "}
                      {SYSSTATE.stressed_pigcount} Heat Stress{" "}
                    </p>
                  </div>
                </div>
              </div>

              {/** TODAY TOTAL COUNT HEAT STRESS */}
              <div className="mb-4 mx-0 sm:ml-4 xl:mr-4">
                <div className="shadow-lg rounded-2xl card bg-base-100 w-full">
                  <div className="p-4 flex items-center justify-start">
                    <BsHash className="w-7 h-7 text-warning" />
                    <p className="ml-1 font-bold text-md">
                      Detection ( Today )
                    </p>
                  </div>
                  <div className="mx-4  mb-4 flex justify-between itms-center">
                    <p className="text-error"> {1} Heat Stress Detection </p>
                  </div>
                </div>
              </div>

              {/** Monitor View Mode */}
              <StreamLayoutBlock
                layout={viewMode}
                set={(val) => {
                  setViewMode(val);
                }}
              />
            </div>

            {/** COL 3 */}
            <div className="w-full sm:w-1/2 xl:w-1/5">
              <ActionBlock
                db_actions={dbActions}
                state={SYSSTATE.status}
                phsActions={phsActions}
              />
            </div>

            {/** COL 4 */}
            <div className="w-full sm:w-1/2 xl:w-1/5">
              {/** QUICK CONTROLS */}
              <QuickControlsBlock
                state={SYSSTATE.status}
                setSelectedModal={setSelectedModal}
              />

              {/** Active Users */}
              <ActiveUserBlock users={dbActiveUsers} />
            </div>

            {/** COL 5 */}
            <div className="w-full sm:w-1/2 xl:w-1/5">
              <PastDetectionBlock pastDetection={dbPastDetection} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
