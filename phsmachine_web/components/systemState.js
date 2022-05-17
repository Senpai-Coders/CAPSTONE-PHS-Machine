import { GoCircuitBoard } from "react-icons/go";
import { BsThermometerHalf } from "react-icons/bs";

const systemState = () => {
  return (
    <div className="flex flex-wrap justify-center space-y-8">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary"></div>
          <div className="stat-title">Total Detections (Today)</div>
          <div className="stat-value text-secondary">1</div>
          <div className="stat-desc">May 15, 2022</div>
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

      <div className="flex">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title text-success">System Status</div>
            <div className="stat-value text-lg">Detecting</div>
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
