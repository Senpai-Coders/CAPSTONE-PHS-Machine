import { useState, useEffect } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import { PI_IP } from "../../helpers";

const PhsScanner = () => {
  const [oct1, set_oct1] = useState(192);
  const [oct2, set_oct2] = useState(168);
  const [oct3, set_oct3] = useState(1);
  const [oct4, set_oct4] = useState(0);

  const [toct1, set_toct1] = useState(192);
  const [toct2, set_toct2] = useState(168);
  const [toct3, set_toct3] = useState(1);
  const [toct4, set_toct4] = useState(1);

  const [scanning, setScanning] = useState(false);
  const [phsDevices, setPhsDevices] = useState([]);

  const scan = async (a, b, c, d, aa, bb, cc, dd) => {
    setScanning(false);

    var from = `${a}.${b}.${c}.${d}`;
    var to = `${aa}.${bb}.${cc}.${dd}`;

    while (from !== to && scanning) {
      var curIp = `${a}.${b}.${c}`;

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
        const checkHost = await axios.get(
          `http://${from}:3000/api/connectivity`
        );
        setPhsDevices([...phsDevices, checkhost]);
      } catch (e) {}
    }
  };

  return (
    <div>
      <div className="flex justify-start p-4 rounded-md items-center">
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
                  set_oct1('')
                  return;
                }
                if (isNaN(v)) return;
                set_oct1(Number.parseInt(v));
              }}
              placeholder="1st"
              className="input input-bordered w-16 "
            />
            <input
              type="text"
              value={oct2}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct2('')
                  return;
                }
                if (isNaN(v)) return;
                set_oct2(Number.parseInt(v));
              }}
              placeholder="2nd "
              className="input input-bordered w-16"
            />
            <input
              type="text"
              value={oct3}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct3('')
                  return;
                }
                if (isNaN(v)) return;
                set_oct3(Number.parseInt(v));
              }}
              placeholder="3rd "
              className="input input-bordered w-16"
            />
            <input
              type="text"
              value={oct4}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_oct4('')
                  return;
                }
                if (isNaN(v)) return;
                set_oct4(Number.parseInt(v));
              }}
              placeholder="4th "
              className="input input-bordered w-16"
            />
          </label>
        </div>
        <HiArrowNarrowRight className="text-2xl mx-4" />
        <div className="form-control ml-2">
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
                  set_toct1('')
                  return;
                }
                if (isNaN(v)) return;
                set_toct1(Number.parseInt(v));
              }}
              placeholder="1st "
              className="input input-bordered w-16 "
            />
            <input
              type="text"
              value={toct2}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_toct2('')
                  return;
                }
                if (isNaN(v)) return;
                set_toct2(Number.parseInt(v));
              }}
              placeholder="2nd "
              className="input input-bordered w-16"
            />
            <input
              type="text"
              value={toct3}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_tct3('')
                  return;
                }
                if (isNaN(v)) return;
                set_toct3(Number.parseInt(v));
              }}
              placeholder="3rd "
              className="input input-bordered w-16"
            />
            <input
              type="text"
              value={toct4}
              onChange={(e) => {
                var v = e.target.value;
                if (v.length === 0) {
                  set_toct4('')
                  return;
                }
                if (isNaN(v)) return;
                set_toct4(Number.parseInt(v));
              }}
              placeholder="4th "
              className="input input-bordered w-16"
            />
            <span onClick={()=>{setScanning(true)}} className={`btn btn-active ${scanning ? 'loading' :''}`}> {scanning ? 'scanning...' : 'Start Scan'}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PhsScanner;
