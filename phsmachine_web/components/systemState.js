import { GoCircuitBoard } from "react-icons/go";
import { BsThermometerHalf } from "react-icons/bs";
import { useEffect, useState } from "react";

import { translateSystemState, dateToWord } from "../helpers";

const systemState = () => {
  const [DETECTIONSTODAY, setDETECTIONSTODAY] = useState(0)
  const [ACTIONSTODAY, setACTIONSTODAY] = useState(0)
  const [SYSSTATE, SETSYSSTATE] = useState({
    status: 0, // -1 Disabled, 0 - Detecting, 1 - Resolving, 2 - Debugging
    active_actions: "None",
    lighting: "Off",
    pig_count: 0,
    stressed_pigcount: 0,
    max_temp: 38.5,
    average_temp: 36.4,
    min_temp: 34.5,
  });

  const getSysStateStyle = (state) => {
    if(state === -1) return 'text-error'
    if(state === 0) return 'animate-pulse text-success'
    if(state === 1) return 'animate-pulse text-accent'
    if(state === 2) return 'animate-pulse text-warning'
  }

  const init = async () => {};

  useEffect(() => {}, []);

  return (
    <div className="flex flex-wrap justify-center space-y-8">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary"></div>
          <div className="stat-title">Total Detections (Today)</div>
          <div className="stat-value text-secondary">1</div>
          <div className="stat-desc">{ dateToWord(new Date()) }</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary"></div>
          <div className="stat-title">Total Actions (Today)</div>
          <div className="stat-value text-secondary">2</div>
          <div className="stat-desc"></div>
        </div>

        <div className="stat">
          <div className="stat-figure text-primary">
            <BsThermometerHalf className="h-8 w-8" />
          </div>
          <div className="stat-title ">Min Temp (today)</div>
          <div className="stat-value font-inter font-thin text-primary">
            34°C
          </div>
          <div className="stat-desc"></div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <BsThermometerHalf className="h-8 w-8" />
          </div>
          <div className="stat-title">Avg Temp (today)</div>
          <div className="stat-value font-inter font-thin text-accent">
            36°C
          </div>
          <div className="stat-desc"></div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <BsThermometerHalf className="h-8 w-8" />
          </div>
          <div className="stat-title">Max Temp (today)</div>
          <div className="stat-value font-inter font-thin text-secondary">
            39°C
          </div>
          <div className="stat-desc"></div>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">System Status</div>
            <div
              className={`stat-value text-lg ${
                getSysStateStyle(SYSSTATE.status)
              }`}
            >
              {translateSystemState(SYSSTATE.status)}
            </div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title"># Defined Actions</div>
            <div className="stat-value text-secondary">2</div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title"># Pig on cam</div>
            <div className="stat-value text-secondary">2</div>
            <div className="stat-desc"></div>
          </div>
        </div>

        <div className="divider divider-horizontal"></div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-base">
              <GoCircuitBoard className="w-6 h-6" />
            </div>
            <div className="stat-title ">Mist</div>
            <div className="stat-value text-lg">Stndby</div>
            <div className="stat-desc">Target: Relay_1</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-base">
              <GoCircuitBoard className="w-6 h-6" />
            </div>
            <div className="stat-title ">Fan</div>
            <div className="stat-value text-lg">Stndby</div>
            <div className="stat-desc">Target: Relay_2</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-success">
              <GoCircuitBoard className="w-6 h-6" />
            </div>
            <div className="stat-title text-">Lights</div>
            <div className="stat-value text-success text-lg ">On</div>
            <div className="stat-desc">Target: Relay_3</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title ">unused</div>
            <div className="stat-value text-lg font-thin">- - -</div>
            <div className="stat-desc">Target: Relay_4</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default systemState;
