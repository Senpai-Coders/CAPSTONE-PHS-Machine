import { setCamMode, getCamMode } from "../../helpers";
import { AiFillFormatPainter } from "react-icons/ai";
import { useEffect, useState } from "react";

const themeChooser = ({ textMode }) => {
  const layouts = [
    { name: "Triple", val: 0 },
    { name: "Dual", val: 1 },
    { name: "Merged", val: 2 },
  ];

  const [selected, setSelected] = useState({ val: -1 });

  useEffect(() => {
    if (selected.val === -1) return;
    setCamMode(selected.val);
  }, [selected]);

  useEffect(() => {
    let chosen = getCamMode();
    setSelected({ val: Number.parseInt(chosen) });
  }, []);

  const findName = (val) => {
    let defMode = { name: "Tripple View", val: 0 };
    for (var x = 0; x < layouts.length; x++)
      if (layouts[x].val === val) {
        defMode = layouts[x];
        break;
      }
    return defMode;
  };

  return (
    <div className="dropdown">
      <label
        tabIndex="0"
        className="btn flex btn-active btn-outline btn-ghost shadow-md btn-sm"
      >
        {!textMode ? (
          <AiFillFormatPainter className="w-6 h-6" />
        ) : (
          <p className="uppercase">{findName(selected.val).name}</p>
        )}
      </label>
      <ul
        tabIndex="0"
        className="dropdown-content dropdown-left menu max-h-56 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/60 rounded-sm"
      >
        {layouts.map((th, i) => (
          <li
            tabIndex={i + 1}
            key={th.name}
            onClick={() => {
              setSelected(th);
            }}
            className={`cursor-pointer duration-100 m-1 snap-center ${
              th.val === selected.val ? "bg-base-200 outline outline-1" : ""
            }`}
          >
            <div className="flex p-4 justify-between">
              <p className="text-sm">{th.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    //   <div>
    //     <div className="flex overflow-x-scroll snap-x overflow-y-hidden h-24 py-2">
    //       {layouts.map((th, i) => (
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
