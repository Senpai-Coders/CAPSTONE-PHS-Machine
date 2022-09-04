import { useState, useEffect } from "react";
import Loading from "../loading";

import { GoCircuitBoard } from "react-icons/go";
import axios from "axios";

const Relays = ({ relays, coreRelays, onSave }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {

  }, [relays]);

  return (
    <div>
      {loading && <Loading />}
      <p className="mt-4 text-sm">
        Relays are electrical switches used by an Actions. You can manually toggle them to check if they function correctly. You can only toggle them on debuggin mode for safety
      </p>
      <div className="mt-4 overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>GPIO Pin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {relays.map((rel, i) => (
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <GoCircuitBoard className="text-xl" />
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
                <input type="checkbox" className="toggle" checked={ !rel.state ? false : rel.state } />
                </th>
              </tr>
            ))}
          </tbody>
          
        </table>
        {
                relays.length === 0 && <p className='text-center'>No relays</p>
            }
      </div>
    </div>
  );
};

export default Relays;
