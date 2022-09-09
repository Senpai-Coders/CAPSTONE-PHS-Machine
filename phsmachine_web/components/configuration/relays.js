import { useState, useEffect } from "react";
import Loading from "../loading";

import { GoCircuitBoard } from "react-icons/go";
import axios from "axios";

import { PI_IP } from "../../helpers";

const Relays = ({ relays, coreRelays, state, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [merged, setMerged] = useState([]);

  const emit = async (relay_name, state) => {
    try {
      const toggle = await axios.post(`http://${PI_IP}:8000/emitRelay`, {
        relay_name,
        state,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getMatchingAction = (relay) => {
    let toReturn = { state: false };
    if (!coreRelays || coreRelays.length === 0) return toReturn;
    else
      for (var x = 0; x < coreRelays.length; x++) {
        if (coreRelays[x].config_name === relay.config_name) {
          toReturn = { ...coreRelays[x] };
          break;
        }
      }
    return toReturn;
  };

  useEffect(() => {
    let merge = [...relays];

    for (var x = 0; x < merge.length; x++) {
      let new_fields = getMatchingAction(merge[x]);
      merge[x] = { ...merge[x], ...new_fields };
    }

    merge.sort((a, b) => Number(b.state) - Number(a.state));

    setMerged(merge);
  }, [relays]);

  return (
    <div>
      {loading && <Loading />}
      <p className="mt-4 text-sm">
        Relays are electrical switches used by an Actions. You can manually
        toggle them to check if they function correctly. You can only toggle
        them on debuggin mode for safety
      </p>
      <div className="mt-4 overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>GPIO Pin</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((rel, i) => (
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <GoCircuitBoard
                        className={`text-2xl ${
                          rel.state ? "animate-pulse text-accent" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-bold">{rel.config_name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost font-medium badge-sm">
                    GPIO {rel.value.GPIO_PIN}
                  </span>
                </td>
                <th>
                  <div className="form-control w-16">
                    <label className="label flex justify-start cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={state !== 2}
                        onChange={(e) => {
                          emit(rel.config_name, e.target.value);
                        }}
                        className={`toggle ${
                          rel.state ? "text-accent" : "opacity-40"
                        }`}
                        checked={!rel.state ? false : rel.state}
                      />
                      <span
                        className={`ml-2 label-text ${
                          rel.state ? "text-accent" : "opacity-40"
                        }`}
                      >
                        {rel.state ? "On" : "Off"}
                      </span>
                    </label>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        {relays.length === 0 && <p className="text-center">No relays</p>}
      </div>
    </div>
  );
};

export default Relays;
