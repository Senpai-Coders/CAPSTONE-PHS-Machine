import { useEffect, useState } from "react";

import ActionComponent from "./component/actionComponent";
import NewActionComponent from "./component/newComponent";
import Loading from "../loading"

const Actions = ({ actions, relays, coreActions, divisionCount }) => {
  const [fActions, setFActions] = useState([]);
  const [newAct, setNewAct] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFActions(actions);
    setLoading(false)
  }, [actions]);

  return (
    <div className="min-h-screen">
        {
            loading && <Loading />
        }
      <p className="mt-4 text-sm">
        You can define different actions that will use devices that can be
        toggled by relays on or off
      </p>
      {!newAct && (
        <button className="btn btn-sm mt-4" onClick={() => setNewAct(true)}>
          New Action
        </button>
      )}
      {newAct && (
        <NewActionComponent
          relayOptions={relays}
          close={() => {
            console.log("Closed Call")
            setNewAct(false);
          }}
          divisionCount = {divisionCount}
          onSave={setLoading}
        />
      )}
      <div className="mt-4">
        {fActions.map((factions, idx) => (
          <ActionComponent
            divisionCount={divisionCount}
            onSave={setLoading}
            relayOptions={relays}
            data={factions}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default Actions;
