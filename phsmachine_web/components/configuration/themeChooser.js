import { setTheme } from "../../helpers";

import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useEffect, useState } from "react";

const themeChooser = () => {
  const themes = [
    { name: "light", type: "light" },
    { name: "dark", type: "dark" },
    { name: "cupcake", type: "light" },
    { name: "bumblebee", type: "light" },
    //{ name: "emerald", type: "light" },
    { name: "corporate", type: "light" },
    //{ name: "synthwave", type: "light" },
    //{ name: "retro", type: "light" },
    //{ name: "cyberpunk", type: "light" },
    { name: "valentine", type: "light" },
    { name: "halloween", type: "dark" },
    //{ name: "garden", type: "light" },
    { name: "forest", type: "dark" },
    //{ name: "aqua", type: "light" },
    { name: "lofi", type: "light" },
    { name: "pastel", type: "light" },
    { name: "fantasy", type: "light" },
    { name: "wireframe", type: "light" },
    { name: "black", type: "dark" },
    { name: "luxury", type: "dark" },
    { name: "dracula", type: "dark" },
    { name: "cmyk", type: "light" },
    { name: "autumn", type: "light" },
    //{ name: "business", type: "dark" },
    { name: "acid", type: "light" },
    //{ name: "lemonade", type: "light" },
    //{ name: "night", type: "dark" },
    { name: "coffee", type: "dark" },
    //{ name: "winter", type: "light" },
  ];

  const [selected, setSelected] = useState({ name: "Choose Theme" });
  const [thMode, setThMode] = useState("light");

  useEffect(() => {
    if (selected.name === "Choose Theme") return;
    setTheme(selected.name);
  }, [selected]);

  return (
    <div>
      <div className="divider">Appearance</div>
      <div>
        <div className="flex items-center">
          <div className="ml-3 flex space-x-2">
            <label
              onClick={() => setThMode("light")}
              className="btn btn-md cursor-pointer"
            >
              <span className="flex items-center">
                <MdOutlineLightMode className="h-4 w-4" />
                Light
              </span>
            </label>
            <label
              onClick={() => setThMode("dark")}
              className="btn btn-md cursor-pointer"
            >
              <span className=" flex items-center">
                <MdDarkMode className="h-7 w-7" />
                Dark
              </span>
            </label>
          </div>
        </div>
        <div className="flex overflow-x-scroll snap-x overflow-y-hidden h-24 py-2">
          {themes.filter((th, i)=> th.type === thMode).map((th, i) => (
            <div
              key={th.name}
              onClick={() => setSelected(th)}
              className="cursor-pointer btn btn-outline duration-500 m-1 snap-center"
            >
                  <div className="p-4 w-44">
                    <p>{th.name}</p>
                    <div className="flex justify-center space-x-2 mt-2">
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
                    </div>
                  </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default themeChooser;
