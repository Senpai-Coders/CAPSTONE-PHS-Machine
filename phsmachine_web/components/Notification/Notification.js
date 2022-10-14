import { useState, useEffect } from "react";
import { IoNotificationsSharp } from "react-icons/io5";

import NotificationContent from "./NotificationContent";

const Notification = ({ userData }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [markAll, setMarkAll] = useState(() => {});

  return (
    <div>
      <div className="dropdown dropdown-end">
        <label tabIndex="1" className="btn btn-sm btn-square btn-ghost mr-2">
          <div className="indicator text-neutral-content">
            <IoNotificationsSharp className="text-xl" />
            {unreadCount > 0 && (
              <span className="indicator-item animate-pulse badge badge-xs badge-primary"></span>
            )}
          </div>
        </label>
        <div
          tabIndex="0"
          className="dropdown-content card card-compact w-72 md:w-96 p-2 shadow-lg bg-base-100/90 backdrop-blur-md"
        >
          <div className="card-body">
            <NotificationContent
              userData={userData}
              setUnreadCount={setUnreadCount}
              setMarkAll={setMarkAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
