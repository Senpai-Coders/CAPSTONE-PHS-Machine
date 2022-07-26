import { setTheme } from "../../helpers";

import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

import { AiFillFormatPainter } from "react-icons/ai";
import { useEffect, useState } from "react";

const themeChooser = () => {
  const themes = [
    { name: "light", type: "light" },
    { name: "dark", type: "dark" },
    { name: "cupcake", type: "light" },
    { name: "halloween", type: "dark" },
    { name: "bumblebee", type: "light" },
    { name: "black", type: "dark" },
    { name: "corporate", type: "light" },
    { name: "forest", type: "dark" },
    { name: "valentine", type: "light" },
    { name: "dracula", type: "dark" },
    { name: "fantasy", type: "light" },
    { name: "luxury", type: "dark" },
    { name: "lofi", type: "light" },
    { name: "coffee", type: "dark" },
    { name: "pastel", type: "light" },
    { name: "acid", type: "light" },
    { name: "wireframe", type: "light" },
    { name: "cmyk", type: "light" },
    { name: "autumn", type: "light" },
    //{ name: "emerald", type: "light" },
    //{ name: "synthwave", type: "light" },
    //{ name: "retro", type: "light" },
    //{ name: "cyberpunk", type: "light" },
    //{ name: "garden", type: "light" },
    //{ name: "aqua", type: "light" },
    //{ name: "business", type: "dark" },
    //{ name: "lemonade", type: "light" },
    //{ name: "night", type: "dark" },
    //{ name: "winter", type: "light" },
  ];

  const [selected, setSelected] = useState({ name: "Choose Theme" });

  useEffect(() => {
    if (selected.name === "Choose Theme") return;
    setTheme(selected.name);
  }, [selected]);

  return (
    <div className="dropdown">
      <label tabIndex="0" className="btn btn-ghost btn-sm btn-square m-1">
        <AiFillFormatPainter className="w-6 h-6" />
      </label>
      <ul
        tabIndex="0"
        className="dropdown-content menu max-h-80 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 rounded-sm"
      >
        {themes.map((th, i) => (
          <li
            tabIndex={i+1}
            key={th.name}
            onClick={() => setSelected(th)}
            className="cursor-pointer duration-100 m-1 snap-center"
          >
            <div className="flex p-4 justify-between">
              <p className="text-sm">{th.name}</p>
              {
                th.type === "dark" ? <MdDarkMode className="text-lg"/> : <MdOutlineLightMode className="text-lg"/> 
              }
              {/* <div className="flex justify-center space-x-2 mt-2">
                <div
                  data-theme={th.name}
                  className="card drop-shadow-xl border h-6 w-6 bg-base"
                />
                <div
                  data-theme={th.name}
                  className="card  drop-shadow-xl border h-6 w-6 bg-primary"
                />
                <div
                  data-theme={th.name}
                  className="card drop-shadow-xl border h-6 w-6 bg-secondar"
                />
                <div
                  data-theme={th.name}
                  className="card drop-shadow-xl border h-6 w-6 bg-accent"
                />
              </div> */}
            </div>
          </li>
        ))}
      </ul>
    </div>

    //   <div>
    //     <div className="flex overflow-x-scroll snap-x overflow-y-hidden h-24 py-2">
    //       {themes.map((th, i) => (
    //           <div
    //             key={th.name}
    //             onClick={() => setSelected(th)}
    //             className="cursor-pointer btn btn-outline duration-500 m-1 snap-center"
    //           >
    //             <div className="p-4 w-44">
    //               <p>{th.name}</p>
    //               <div className="flex justify-center space-x-2 mt-2">
    //                 <div
    //                   data-theme={th.name}
    //                   className="card drop-shadow-xl border h-6 w-6 bg-base"
    //                 />
    //                 <div
    //                   data-theme={th.name}
    //                   className="card  drop-shadow-xl border h-6 w-6 bg-primary"
    //                 />
    //                 <div
    //                   data-theme={th.name}
    //                   className="card drop-shadow-xl border h-6 w-6 bg-secondar"
    //                 />
    //                 <div
    //                   data-theme={th.name}
    //                   className="card drop-shadow-xl border h-6 w-6 bg-accent"
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //     </div>
    //   </div>
  );
};

export default themeChooser;
