import { useState } from "react";
import { BiExport } from "react-icons/bi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { BsFillFileEarmarkZipFill } from "react-icons/bs";
import { FaFileCsv } from "react-icons/fa";

import { appendToFSUrl } from "../../helpers";

import axios from "axios";

const ExportConfirm = ({ close, shown, onAccept }) => {
  const [toExcel, setToExcel] = useState(true);
  const [toCsv, setToCsv] = useState(true);
  const [toZip, setToZip] = useState(true);

  const [exporting, setExporting] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]);

  const requestFiles = async () => {
    try {
      setExporting(true);
      const requestResponse = await axios.post("/api/phs/detection", {
        mode: 4,
        toExport: {
          toExcel,
          toCsv,
          toZip,
        },
      });
      setExporting(false);

      setDownloadLinks(requestResponse.data.downloadLinks);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Export Records</h3>
          <BiExport className="w-6 h-6" />
        </div>
        <p className="text-sm mt-3">
          It's a good idea to get a copy of the heat stress detection datas for
          backup and further analyzation of the datas.
        </p>
        {downloadLinks.length === 0 && !exporting && (
          <div className="mt-4">
            <div className="divider"></div>
            <p className="font-black">Chose File Format</p>

            <div className="form-control font-medium">
              <label className="label mt-3  cursor-pointer flex justify-start">
                <input
                  type="checkbox"
                  onChange={(e) => setToExcel(e.target.checked)}
                  checked={toExcel}
                  className="checkbox"
                />
                <RiFileExcel2Fill className="ml-2 text-xl" />
                <span className="label-text ml-2">Excel</span>
              </label>
              <p className="text-sm font-normal">
                Export detection to excel. (raw data & images not included)
              </p>

              <label className="label mt-3  cursor-pointer  flex justify-start">
                <input
                  type="checkbox"
                  onChange={(e) => setToCsv(e.target.checked)}
                  checked={toCsv}
                  className="checkbox"
                />
                <FaFileCsv className="ml-2 text-xl" />
                <span className="label-text ml-2">CSV</span>
              </label>
              <p className="text-sm font-normal">
                Export detection to csv format (raw data & images not included)
              </p>

              <label className="label mt-3  cursor-pointer flex justify-start">
                <input
                  type="checkbox"
                  onChange={(e) => setToZip(e.target.checked)}
                  checked={toZip}
                  className="checkbox"
                />
                <BsFillFileEarmarkZipFill className="ml-2 text-xl" />
                <span className="label-text ml-2">Zip</span>
              </label>
              <p className="text-sm font-normal">
                All raw data and images will be included
              </p>
            </div>

            <div className="divider"></div>
          </div>
        )}

        {exporting && (
          <>
            <progress className="progress mt-4 mx-auto"></progress>
            <p className="text-xs text-center mt-2">
              processing export, please wait.
            </p>
          </>
        )}

        {downloadLinks.length > 0 && (
          <div className="mt-4">
            <p className="font-black">Export Ready, click to download them</p>
            <div className="form-control font-medium">
              {downloadLinks.map((lnks, id) => (
                <label
                  key={id}
                  className="label mt-3  cursor-pointer flex justify-start"
                >
                  {lnks.type === "xlsx" && (
                    <RiFileExcel2Fill className="text-3xl" />
                  )}
                  {lnks.type === "csv" && <FaFileCsv className="text-3xl" />}
                  {lnks.type === "zip" && (
                    <BsFillFileEarmarkZipFill className="text-3xl" />
                  )}
                  <span
                    onClick={() =>
                      window.open(appendToFSUrl(lnks.link), "_blank")
                    }
                    className="ml-2 truncate underline"
                  >
                    {lnks.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="modal-action">
          {downloadLinks.length === 0 && (
            <button
              disabled={!toExcel && !toCsv && !toZip}
              onClick={() => {
                if (exporting) return;
                requestFiles();
              }}
              className={`btn ${exporting ? "loading" : ""}`}
            >
              Export
            </button>
          )}
          <label
            disabled={exporting}
            onClick={() => {
              setDownloadLinks([]);
              close();
            }}
            className="btn"
          >
            {downloadLinks.length === 0 ? "Cancel" : "Done"}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ExportConfirm;
