import NavBar from "./navbar";
import { useState } from "react";

export default function Layout({ children }) {
  const [toggled, setToggled] = useState(false);
  const [userToggled, setUserToggled] = useState(false);

  return (
    <>
      <div className=" relative h-screen ">
        <NavBar
          toggled={toggled}
          setToggled={setToggled}
          setUserToggled={setUserToggled}
          userToggled={userToggled}
        />
        <main className="pt-14 relative card bg-stone-50/5">
          <div
            onClick={() => {
              setToggled(false);
              setUserToggled(false);
            }}
            className="p-5 md:p-10"
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
