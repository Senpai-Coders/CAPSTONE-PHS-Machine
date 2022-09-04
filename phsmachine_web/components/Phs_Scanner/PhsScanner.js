import { useState, useEffect } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import { PI_IP } from "../../helpers";

import { RiComputerFill } from "react-icons/ri";

const PhsScanner = ({ onSwitch, curIp }) => {
  const [oct1, set_oct1] = useState(192);
  const [oct2, set_oct2] = useState(168);
  const [oct3, set_oct3] = useState(1);
  const [oct4, set_oct4] = useState(0);

  const [toct1, set_toct1] = useState(192);
  const [toct2, set_toct2] = useState(168);
  const [toct3, set_toct3] = useState(1);
  const [toct4, set_toct4] = useState(10);

  const [scanning, setScanning] = useState(false);
  const [phsDevices, setPhsDevices] = useState([]);

  const [focIp, setFocIp] = useState("");

  let CancelToken = axios.CancelToken;
  let source = CancelToken.source();

  const send = (email) =>
    new Promise((resolve) => setTimeout(() => resolve(email), 1000));

  const scan = async (a, b, c, d, aa, bb, cc, dd) => {
    setPhsDevices([]);
    var from = `${a}.${b}.${c}.${d}`;
    var to = `${aa}.${bb}.${cc}.${dd}`;

    let devices = [];

    while (from !== to) {
      from = `${a}.${b}.${c}.${d}`;

      if (d >= 255) {
        d = 0;
        c++;
      } else d++;

      if (c >= 255) {
        c = 0;
        b++;
      }

      if (b >= 255) {
        a++;
        b = 0;
      }
      if (a >= 255) break;

      try {
        setFocIp(from);

        let response = await axios({
          method: "get",
          url: `http://${from}:3000/api/connectivity`,
          timeout: 500, // only wait for 2s
          withCredentials: false,
          body: { mode: 0 },
          data: { mode: 1 },
        });

        setPhsDevices((val) => [...val, response.data]);
        //devices.push(response.data);
      } catch (e) {
        console.log("fail ");
      }
    }
    console.log("done");
    setScanning(false);
    // setPhsDevices(devices)
  };

  return (
    <div className="p-4 ">
      <div className="md:flex justify-start rounded-md items-center">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Start IP</span>
          </label>
          <label className="input-group ">
            <input
              type="text"
              value={oct1}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct1("");
                  return;
                }
                if (isNaN(v)) return;
                set_oct1(Number.parseInt(v));
              }}
              placeholder="1st"
              className="input input-bordered w-14 "
            />
            <input
              type="text"
              value={oct2}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct2("");
                  return;
                }
                if (isNaN(v)) return;
                set_oct2(Number.parseInt(v));
              }}
              placeholder="2nd "
              className="input input-bordered w-14"
            />
            <input
              type="text"
              value={oct3}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct3("");
                  return;
                }
                if (isNaN(v)) return;
                set_oct3(Number.parseInt(v));
              }}
              placeholder="3rd "
              className="input input-bordered w-14"
            />
            <input
              type="text"
              value={oct4}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct4("");
                  return;
                }
                if (isNaN(v)) return;
                set_oct4(Number.parseInt(v));
              }}
              placeholder="4th "
              className="input input-bordered w-14"
            />
          </label>
        </div>
        <HiArrowNarrowRight className="text-2xl mx-4 hidden md:block" />
        <div className="form-control md:ml-2">
          <label className="label">
            <span className="label-text font-medium">End IP</span>
          </label>
          <label className="input-group ">
            <input
              type="text"
              value={toct1}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_toct1("");
                  return;
                }
                if (isNaN(v)) return;
                set_toct1(Number.parseInt(v));
              }}
              placeholder="1st "
              className="input input-bordered w-14 "
            />
            <input
              type="text"
              value={toct2}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_toct2("");
                  return;
                }
                if (isNaN(v)) return;
                set_toct2(Number.parseInt(v));
              }}
              placeholder="2nd "
              className="input input-bordered w-14"
            />
            <input
              type="text"
              value={toct3}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_tct3("");
                  return;
                }
                if (isNaN(v)) return;
                set_toct3(Number.parseInt(v));
              }}
              placeholder="3rd "
              className="input input-bordered w-14"
            />
            <input
              type="text"
              value={toct4}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_toct4("");
                  return;
                }
                if (isNaN(v)) return;
                set_toct4(Number.parseInt(v));
              }}
              placeholder="4th "
              className="input input-bordered w-14"
            />
          </label>
        </div>
      </div>
      <span
        onClick={() => {
          if (!scanning) {
            setScanning(true);
            scan(oct1, oct2, oct3, oct4, toct1, toct2, toct3, toct4);
          }
        }}
        className={`btn btn-full mt-4 ${scanning ? "loading" : "btn-active"}`}
      >
        {scanning ? (
          <div className="flex items-center justify-start">
            <p className="text-sm mr-2">Checking : {focIp}</p>{" "}
            <progress className="progress w-8 progress-accent"></progress>
          </div>
        ) : (
          "start scan"
        )}
      </span>
      <div className="mt-4">
        <div className="overflow-x-scroll w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>PHS</th>
                <th>URL</th>
                <th>Host IP</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {phsDevices.map((dev, i) => (
                <tr>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="">
                          <RiComputerFill className="text-xl" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{dev.server_name}</div>
                        <div className="text-sm opacity-50">{dev.version}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm">{dev.url}</p>
                    {/* <span className="badge badge-ghost badge-sm">
                      Desktop Support Technician
                    </span> */}
                  </td>
                  <td>{dev.ip}</td>
                  <th>
                    <button
                      onClick={() => {
                        onSwitch(dev);
                        window.scrollTo(0, 0);
                      }}
                      className={`btn btn-xs ${
                        curIp === dev.ip ? "btn-success" : ""
                      }`}
                    >
                      {curIp === dev.ip ? "current" : "switch"}
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhsScanner;