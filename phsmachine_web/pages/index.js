import Layout from "../components/layout";
import { useRouter } from "next/router";

import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  OffAlert,
  RebootConfirm,
  ShutdownConfirm,
} from "../components/modals/";
import { PI_IP } from "../helpers";

import { GiPig } from "react-icons/gi";
import { BsHash } from "react-icons/bs";

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

export default function Home() {
  const router = useRouter();

  axios.defaults.timeout = 4 * 1000

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

  const [exited, setExited] = useState(false);
  const [stamp, setStamp] = useState(0);

  const [isDown, setIsDown] = useState(true);
  const [seenModal, setSeenModal] = useState(false);
  const [dbPastDetection, setPastDetection] = useState([]);

  const [viewMode, setViewMode] = useState(0); // 0 - 3iple, 1 - dual (1 with dropdown option select), 2 - Merged Normal & Thermal
  const [selectedModal, setSelectedModal] = useState(-1); // -1 off or no shown modal by default
  // -1 off modal
  // -2 shutdown confirm
  // -3 Reboot Confirm

  const [phsStorage, setPhsStorage] = useState({
        diskPath: '/',
        free: 0,
        size: 0
  })
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

  const phs_init = async () => {
    try {
      if(exited) return;
      const phs_response = await axios.get(
        `http://${PI_IP}:8000/getSystemState`
      , {});
      const phs_actions = await axios.get(
        `http://${PI_IP}:8000/getActionState`
      , {});
      if (exited) return;
      setACTIONSTATE(phs_actions.data.actions);
      SETSYSSTATE(phs_response.data.state);
      setIsDown(false);
    } catch (e) {
      setIsDown(true);
      SETSYSSTATE({ ...SYSSTATE, status: -2 });
    }
  };

  const init = async () => {
    try {
      if (exited) return;
      const db_actions = await axios.post("/api/phs/config/actions", {
        mode: 2,
      });
      const db_active_users = await axios.post("/api/phs/activeUsers", {});
      const db_past_detections = await axios.post("/api/phs/detection", {
        mode: 3,
      });

      const phs_storage = await axios.post("/api/phs/phs_storage", {})
      setPhsStorage(phs_storage.data.storage)
      setDbActions(db_actions.data.actions);
      setDbActiveUsers(db_active_users.data.activeUsers);
      setPastDetection(db_past_detections.data.detections);
    } catch (e) {}
  };

  useEffect(() => {
    let stmp = new Date().getTime();

    var loader = setInterval(async () => {
      if (exited) return;
      setStamp(stmp);
      console.log("Render", stmp);
      phs_init();
      init();
    }, 2000);

    return () => {
      clearInterval(loader);
      console.log("unmounted stmp ", stmp);
      setExited(true);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Monitor</title>
      </Head>

      {/** MODALS */}
      <OffAlert
        shown={isDown && !seenModal}
        close={() => {
          setSelectedModal(-1);
          setSeenModal(true);
        }}
      />

      <ShutdownConfirm
        shown={selectedModal === -2}
        onAccept={() => {
          router.push("/shutdown");
          axios.post("/api/phs/config/power", { mode : 0 })
        }}
        close={() => {
          setSelectedModal(-1);
        }}
      />

      <RebootConfirm
        shown={selectedModal === -3}
        onAccept={() => {
          router.push("/reboot");
          axios.post("/api/phs/config/power", { mode : 1 })
        }}
        close={() => {
          setSelectedModal(-1);
        }}
      />

      {/** MAIN CONTAINER */}
      <div className="mt-8 space-y-2 relative min-h-screen">
        {/** MONITORING LAYOUT */}
        <div></div>

        {/** STATUS LAYOUT */}
        <div>
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
            <div class="w-full sm:w-1/2 xl:w-1/5">
              {/** REALTIME PIG DETECT Count BLOCK */}
              <div class="mb-4 mx-0 sm:ml-4 xl:mr-4">
                <div class="shadow-lg rounded-2xl card bg-base-100 w-full">
                  <div className="p-4 flex items-center justify-start">
                    <GiPig className="w-7 h-7 text-pink-200" />
                    <p class="ml-2 font-bold text-md">{0} Pig On Frame</p>
                  </div>
                  <div className="mx-4 mb-4 flex justify-between itms-center">
                    <p className="text-success">{0} Normal</p>
                    <p className="text-error"> {1} Heat Stress </p>
                  </div>
                </div>
              </div>

              {/** TODAY TOTAL COUNT HEAT STRESS */}
              <div class="mb-4 mx-0 sm:ml-4 xl:mr-4">
                <div class="shadow-lg rounded-2xl card bg-base-100 w-full">
                  <div className="p-4 flex items-center justify-start">
                    <BsHash className="w-7 h-7 text-warning" />
                    <p class="ml-1 font-bold text-md">Detection ( Today )</p>
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
            <div class="w-full sm:w-1/2 xl:w-1/5">
              <ActionBlock
                db_actions={dbActions}
                state={SYSSTATE.status}
                phsActions={phsActions}
              />
            </div>

            {/** COL 4 */}
            <div class="w-full sm:w-1/2 xl:w-1/5">
              {/** QUICK CONTROLS */}
              <QuickControlsBlock
                state={SYSSTATE.status}
                setSelectedModal={setSelectedModal}
              />

              {/** Active Users */}
              <ActiveUserBlock users={dbActiveUsers} />
            </div>

            {/** COL 5 */}
            <div class="w-full sm:w-1/2 xl:w-1/5">
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
