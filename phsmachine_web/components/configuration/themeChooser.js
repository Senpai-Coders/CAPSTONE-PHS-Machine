import { setTheme, loadTheme } from "../../helpers";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { AiFillFormatPainter } from "react-icons/ai";
import { useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const themeChooser = ({ textMode }) => {
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
    { name: "lofi", type: "light" },
    { name: "coffee", type: "dark" },
    { name: "pastel", type: "light" },
    { name: "acid", type: "light" },
    { name: "wireframe", type: "light" },
    { name: "cmyk", type: "light" },
    { name: "autumn", type: "light" },
  ];

  const [selected, setSelected] = useState({ name: "Choose Theme" });

  useEffect(() => {
    if (selected.name === "Choose Theme") return;
    setTheme(selected.name);
  }, [selected]);

  useEffect(() => {
    let chosen = loadTheme();
    setSelected({ name: chosen });
  }, []);

  return (
    <div className="dropdown">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        theme={"dark"}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <label
        tabIndex="0"
        className="btn flex btn-active btn-outline btn-ghost shadow-md btn-sm"
      >
        {!textMode ? (
          <AiFillFormatPainter className="w-6 h-6" />
        ) : (
          <p className="uppercase">{selected.name}</p>
        )}
      </label>
      <ul
        tabIndex="0"
        className="dropdown-content outline outline-1 outline-accent menu max-h-56 overflow-y-scroll px-3 py-4 shadow backdrop-blur-sm bg-base-100/80 rounded-sm"
      >
        {themes.map((th, i) => (
          <li
            tabIndex={i + 1}
            key={th.name}
            onClick={() => {
              toast.success(`Theme changed to ${th.name}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              });
              setSelected(th);
            }}
            className={`cursor-pointer duration-100 m-1 snap-center ${
              th.name === selected.name ? "bg-base-200 outline outline-1" : ""
            }`}
          >
            <div className="flex p-4 justify-between">
              <p className="text-sm">{th.name}</p>
              {th.type === "dark" ? (
                <MdDarkMode className="text-lg" />
              ) : (
                <MdOutlineLightMode className="text-lg" />
              )}
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
  );
};

export default themeChooser;
