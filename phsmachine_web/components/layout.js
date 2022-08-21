import NavBar from "./navbar";
import { useState } from 'react'

export default function Layout({ children }) {

  const [toggled, setToggled] = useState(false);

  return (
    <>
      <div className=" relative h-screen ">
        <NavBar toggled={toggled} setToggled={setToggled} />
        <main className="pt-14 relative card bg-stone-50/5">
          <div onClick={()=>{ setToggled(false) }} className="p-5 md:p-10">{children}</div>
        </main>
      </div>
    </>
  );
}
