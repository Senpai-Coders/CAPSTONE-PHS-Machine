import { GoCircuitBoard } from "react-icons/go";
import { BsThermometerHalf } from "react-icons/bs";
import { useState } from "react";
import { RiAlarmWarningFill } from 'react-icons/ri'

import { translateSystemState, dateToWord } from "../helpers";

const systemState = ({ ACTIONSTATE, SYSSTATE }) => {
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
        <div className="stats shadow snap-x">
          <div className="stat snap-center">
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
          <div className="stat snap-center">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title"># Defined Actions</div>
            <div className="stat-value text-secondary">2</div>
            <div className="stat-desc"></div>
          </div>
          <div className="stat snap-center">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title"># Pig on cam</div>
            <div className="stat-value text-secondary">
              {SYSSTATE.pig_count}
            </div>
            <div className="stat-desc"></div>
          </div>
          <div className="stat snap-center">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Total Detections (Today)</div>
            <div className="stat-value text-primary">{DETECTIONSTODAY}</div>
            <div className="stat-desc"></div>
          </div>
          <div className="stat snap-center">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Total Actions (Today)</div>
            <div className="stat-value text-primary">{ACTIONSTODAY}</div>
            <div className="stat-desc"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="stats snap-x shadow">
          <div className="stat snap-center">
            <div className="stat-figure text-primary">
              <BsThermometerHalf className="h-8 w-8" />
            </div>
            <div className="stat-title ">Min Temp</div>
            <div className="stat-value font-inter font-thin text-primary">
              {SYSSTATE.min_temp}°C
            </div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat snap-center">
            <div className="stat-figure text-accent">
              <BsThermometerHalf className="h-8 w-8" />
            </div>
            <div className="stat-title">Avg Temp</div>
            <div className="stat-value font-inter font-thin text-accent">
              {SYSSTATE.average_temp}°C
            </div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat snap-center">
            <div className="stat-figure text-error">
              <BsThermometerHalf className="h-8 w-8" />
            </div>
            <div className="stat-title">Max Temp</div>
            <div className="stat-value font-inter font-thin text-error">
              {SYSSTATE.max_temp}°C
            </div>
            <div className="stat-desc"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {ACTIONSTATE.length === 0 && SYSSTATE.status >= 0 && SYSSTATE.status !== 3 && (
          <div className="alert text-sm shadow-lg">
          <div className="items-center">
            <RiAlarmWarningFill className="w-6 h-6"/>
            <span>There are 0 actions. You can add on settings</span>
          </div>
        </div>
        )}
        <div className="stats snap-x shadow">
          {ACTIONSTATE.map((def_ac, i) => (
            <div
              key={i}
              className={`stat snap-center duration-500  ${
                def_ac.state ? "text-accent" : ""
              }`}
            >
              <div
                className={`stat-figure  text-base ${
                  def_ac.state ? "text-accent animate-pulse" : ""
                }`}
              >
                <GoCircuitBoard className={ `w-6 h-6 ${def_ac.state ? "shadow-xl shadow-accent" : ''}`} />
              </div>
              <div className="stat-title ">{def_ac.config_name}</div>
              <div
                className={`stat-value text-lg  ${
                  def_ac.state ? "text-accent animate-pulse" : ""
                }`}
              >
                {def_ac.state ? "Active" : "Stndby"}
              </div>
              <div className="stat-desc">{def_ac.target_relay}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default systemState;
