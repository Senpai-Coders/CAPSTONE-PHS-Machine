import { useEffect, useState } from "react";
import axios from "axios";
import { appendToFSUrl } from "../../helpers";

import { MdRefresh } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

const weblogs = () => {
  const [content, setContent] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState("");
  const [loading, setLoading] = useState(false);

  const init = async () => {
    setLoading(true);
    try {
      const getLogs = await axios.post("/api/phs/phsLogs", {
        mode: 0,
        category: "web",
        name: "2022-09-10.log",
      });
      setLogs(getLogs.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      if (loadContent === "") return;
      const getLogs = await axios.post("/api/phs/phsLogs", {
        mode: 1,
        category: "web",
        name: selectedLog,
      });
      setContent(getLogs.data.content);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [selectedLog]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="mt-4 md:flex md:space-x-4 relative md:h-screen">
      <div className=" md:w-3/12 card outline-base-300 outline outline-1 p-4 shadow-xl">
        <div className="flex justify-between items-center">
          <p className="">
            <span className="font-bold">{logs.length} </span>Retrieved Log(s)
          </p>
          <buttton
            onClick={() => {
              init();
              loadContent();
            }}
            className={`btn btn-sm btn-square `}
          >
            <MdRefresh className={`${loading ? "animate-spin" : ""} text-lg`} />
          </buttton>
        </div>
        <ul className="block h-32 md:h-max mt-4 overflow-y-scroll font-mono">
          {logs.map((log, i) => (
            <li
              onClick={() => {
                setSelectedLog(log);
              }}
              className={`my-2 ${
                selectedLog === log ? "border-l-4 border-accent" : ""
              } duration-300 cursor-pointer hover:bg-base-300 px-6 py-2 w-full ${
                selectedLog === log ? "bg-base-300" : " bg-base-200"
              }`}
              key={i}
            >
              <div className="flex justify-between">
                <p className="text-sm">{log}</p>
                <FaDownload
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(appendToFSUrl(`/logs/web/${log}`), "_blank");
                  }}
                  className="text-lg"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="ml-0 mockup-code mt-4 md:mt-0 md:w-9/12 overflow-scroll">
        {content.length > 0 &&
          content.split("\n").map((row, idx) => (
            <pre idx={idx} data-prefix={idx + 1}>
              <code>{row}</code>
            </pre>
          ))}
        {content.length === 0 && (
          <pre data-prefix="$">
            <code>No Content</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default weblogs;
