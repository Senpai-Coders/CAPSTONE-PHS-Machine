import React, { useState } from "react";
import { BsBootstrapReboot } from "react-icons/bs";
import { useRouter } from "next/router";

const RebootConfirm = ({ close, shown, onAccept }) => {
  const router = useRouter();

  const [default_users, setDefaultUsers] = useState(true);
  const [settings, setSettings] = useState(true);
  const [detections, setDetections] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [del_user_photos, setDelUserPhotos] = useState(true);
  const [del_detect_files, setDelDetectFiles] = useState(true);
  const [del_exports, setDelExports] = useState(true);
  const [del_errors, setDelErrors] = useState(true);
  const [del_system_logs, setDelSystemLogs] = useState(true);

  const reset = () => {
    router.push(`/reset?default_users=${default_users}&settings=${settings}&notifications=${notifications}&detections=${detections}&del_user_photos=${del_user_photos}&del_detect_files=${del_detect_files}&del_exports=${del_exports}&del_errors=${del_errors}&del_system_logs=${del_system_logs}&passed=${true}`);
  };

  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Reset Confirmation</h3>
          <BsBootstrapReboot className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm mt-2">
          These are states that will be affected on reset, you can choose
          what to include on reset.
        </p>
        <div className="mt-4">
          <div className="divider"></div>
          <p className="font-black">Database</p>
          <p className=" text-sm font-normal">Primary storage of configurations, accounts, detections, etc..</p>

          <div className="form-control font-medium">
            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDefaultUsers(e.target.checked)}
                checked={default_users}
                className="checkbox"
              />
              <span className="label-text ml-2">Users</span>
            </label>
            <p className="text-xs font-normal">Remove all users except root user</p>
            <label className="label mt-2  cursor-pointer  flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setSettings(e.target.checked)}
                checked={settings}
                className="checkbox"
              />
              <span className="label-text ml-2">Settings</span>
            </label>
            <p className="text-xs font-normal">Reset all settings to default</p>

            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDetections(e.target.checked)}
                checked={detections}
                className="checkbox"
              />
              <span className="label-text ml-2">Detections</span>
            </label>
            <p className="text-xs font-normal">Remove all detection records on database (raw files not included)</p>

            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setNotifications(e.target.checked)}
                checked={notifications}
                className="checkbox"
              />
              <span className="label-text ml-2">Notifications</span>
            </label>
            <p className=" text-xs font-normal">Remove all notifications</p>

          </div>

          <div className="divider"></div>
          <p className="mt-4 font-black">Files & Logs</p>
          <p className=" text-sm font-normal">PHS also save data's on storage aside from database. These can also be deleted</p>

          <div className="form-control mt-2 font-medium">
            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDelUserPhotos(e.target.checked)}
                checked={del_user_photos}
                className="checkbox"
              />
              <span className="label-text ml-2">User Profile Photo's</span>
            </label>
            <p className=" text-xs font-normal">User profile pictures at <span className="font-bold">public/images/*</span></p>

            <label className="label mt-2  cursor-pointer  flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDelDetectFiles(e.target.checked)}
                checked={del_detect_files}
                className="checkbox"
              />
              <span className="label-text ml-2">Detection raw data's</span>
            </label>
            <p className=" text-xs font-normal">Raw detection data's at <span className="font-bold">public/detection/*</span></p>

            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDelExports(e.target.checked)}
                checked={del_exports}
                className="checkbox"
              />
              <span className="label-text ml-2">Exported Data's</span>
            </label>
            <p className=" text-xs font-normal">Copy of Exported data files at <span className="font-bold">public/exports/*</span></p>

            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDelErrors(e.target.checked)}
                checked={del_errors}
                className="checkbox"
              />
              <span className="label-text ml-2">Error Logs</span>
            </label>
            <p className=" text-xs font-normal">PHS error logs at <span className="font-bold">logs/error-logs.json</span></p>

            <label className="label mt-2  cursor-pointer flex justify-start">
              <input
                type="checkbox"
                onChange={(e) => setDelSystemLogs(e.target.checked)}
                checked={del_system_logs}
                className="checkbox"
              />
              <span className="label-text ml-2">System Logs</span>
            </label>
            <p className="text-xs font-normal">Include deletion for PHS logs at <span className="font-bold">logs/phs-core-logs.txt <span className="font-normal">and</span> logs/phs-web-logs.txt</span></p>
          </div>
          <div className="divider"></div>
        </div>

        <p className="mt-4 text-sm text-center text-error">
          The system will also reboot after the reset. Do you want to proceed?
        </p>

        <div className="modal-action">
          <label
            onClick={() => {
              close();
              reset();
              onAccept();
            }}
            className="btn"
          >
            Reset Now
          </label>
          <label onClick={() => close()} className="btn">
            Cancel
          </label>
        </div>
      </div>
    </div>
  );
};

export default RebootConfirm;
