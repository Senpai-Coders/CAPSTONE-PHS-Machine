import { GoCircuitBoard } from "react-icons/go";
import { BsThermometerHalf } from "react-icons/bs";
import { useState } from "react";

import { translateSystemState, dateToWord } from "../helpers";

const systemState = ({ SYSSTATE }) => {
  const [DETECTIONSTODAY, setDETECTIONSTODAY] = useState(0);
  const [ACTIONSTODAY, setACTIONSTODAY] = useState(0);

  const getSysStateStyle = (state) => {
    if (state === -2) return "text-primary";
    if (state === -1) return "text-error";
    if (state === 0) return "animate-pulse text-success";
    if (state === 1) return "animate-pulse text-accent";
    if (state === 2) return "animate-pulse text-warning";
    if (state === 3) return "animate-pulse text-primary";
  };

  const getIoStateStyle = (state) => {
    if (state === -1) return "text-primary"; // - Unknown
    if (state === 0) return "text-primary"; // - Stndby
    if (state === 1) return "animate-pulse text-success"; // - Active/On
  };

  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="flex justify-center">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">System Status</div>
            <div
              className={`stat-value text-lg ${getSysStateStyle(
                SYSSTATE.status
              )}`}
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
            <div className="stat-value text-secondary">
              {SYSSTATE.pig_count}
            </div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Total Detections (Today)</div>
            <div className="stat-value text-primary">1</div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Total Actions (Today)</div>
            <div className="stat-value text-primary">2</div>
            <div className="stat-desc"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="stats snap-x shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <BsThermometerHalf className="h-8 w-8" />
            </div>
            <div className="stat-title ">Min Temp (today)</div>
            <div className="stat-value font-inter font-thin text-primary">
              {SYSSTATE.min_temp}°C
            </div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <BsThermometerHalf className="h-8 w-8" />
            </div>
            <div className="stat-title">Avg Temp (today)</div>
            <div className="stat-value font-inter font-thin text-accent">
              {SYSSTATE.average_temp}°C
            </div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <BsThermometerHalf className="h-8 w-8" />
            </div>
            <div className="stat-title">Max Temp (today)</div>
            <div className="stat-value font-inter font-thin text-error">
              {SYSSTATE.max_temp}°C
            </div>
            <div className="stat-desc"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
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
            <div className="stat-figure">
              <GoCircuitBoard className="w-6 h-6" />
            </div>
            <div className="stat-title text-">Lights</div>
            <div className="stat-value text-lg ">Stnby</div>
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
