import { useState, useEffect } from "react";

import { CgThermostat } from "react-icons/cg";
import { VscBellDot, VscError } from "react-icons/vsc";
import { BsClockHistory } from "react-icons/bs";
import { HiLink } from "react-icons/hi";

import {
  dateToWord,
  PI_IP,
  getMyData,
  localErrorLoad,
  localErrorDeleteAll,
  localErrorSetReadAll,
} from "../../helpers/index";

import axios from "axios";

const NotificationContent = ({ userData, setUnreadCount }) => {
  axios.defaults.timeout = 4 * 1000;

  const [notifications, setNotifications] = useState([]);

  const markAll = async (notifs) => {
    localErrorSetReadAll(userData._id);

    let ids = [];
    if (notifs.length <= 0) return;

    notifs.forEach((notif, id) => {
      if (!notif._id) return;
      ids.push(notif._id);
    });

    try {
      const request = await axios.post("/api/phs/notifications", {
        mode: 1,
        ids,
      });
      load();
    } catch (e) {}
  };

  const deleteAll = async () => {
    try {
      localErrorDeleteAll();
      const request = await axios.post("/api/phs/notifications", { mode: -2 });
      load();
    } catch (e) {}
  };

  const getPhsDbErrors = async () => {
    try {
      const request = await axios.post("/api/phs/notifications", { mode: 0 });
      return request;
    } catch (e) {
      const fltr = notifications.filter((not) => {
        console.log("foc ", not);
        return not._id !== undefined;
      });
      return {
        data: { unreads: 0, notifications: fltr },
      };
    }
  };

  const load = async () => {
    try {
      const userD = await getMyData();
      const joined = localErrorLoad();
      let localUnread = 0;
      if (userD)
        joined.forEach((localErr) => {
          if (!(localErr.seenBy.indexOf(userD._id) > -1)) localUnread++;
        });

      const request = await getPhsDbErrors();

      joined = [...request.data.notifications, ...joined];
      joined = joined.sort((a, b) => {
        return new Date(a.date) < new Date(b.date) ? 1 : -1;
      });

      setNotifications(joined);
      setUnreadCount(request.data.unreads + localUnread);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    var loader = setInterval(async () => {
      load();
    }, 2000);

    return () => {
      clearInterval(loader);
    };
  }, []);

  const getColorCode = (type) => {
    if (type == "detection") return "text-accent";
    if (type == "error") return "text-error";
    if (type == "reminder") return "text-info";
    if (type == "notify") return "";
    return "";
  };

  const getLink = (originalUrl, shortUrl, mode) => {
    if (mode) return `http://${PI_IP}:3000${shortUrl}`;
    return originalUrl;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">Notifications</p>
        <p
          className="text-right underline cursor-pointer"
          onClick={() => markAll(notifications)}
        >
          Mark all as read
        </p>
      </div>
      <div className="mt-3 max-h-96 shadow-inner overflow-y-scroll">
        {notifications.length <= 0 ? (
          <p className="my-4 text-center text-sm opacity-70">No Notification</p>
        ) : (
          <>
            {notifications.map((notif, idx) => (
              <div
                className={`border-b-2 duration-200 ease-out ${
                  notif.isMarkedSeen
                    ? "bg-base-200/30"
                    : `border-l-4 ${
                        notif.notification_type == "error" ||
                        notif.notification_type == "detection"
                          ? "border-error"
                          : notif.notification_type == "reminder"
                          ? "border-info"
                          : "border-accent"
                      }`
                } hover:bg-base-200/40 p-4`}
              >
                <div className="flex justify-start items-center">
                  <div
                    className={`
                  ${getColorCode(notif.notification_type)}
                  btn btn-square btn-sm btn-ghost mr-2 text-2xl`}
                  >
                    {notif.notification_type == "detection" && <CgThermostat />}
                    {notif.notification_type == "error" && (
                      <VscError className=" animate-pulse" />
                    )}
                    {notif.notification_type == "notify" && <VscBellDot />}
                    {notif.notification_type == "reminder" && (
                      <BsClockHistory />
                    )}
                  </div>
                  <p className="font-medium ">{notif.title}</p>
                </div>
                <p className="mt-1 text-sm">{notif.message}</p>
                {notif.notification_type == "error" && (
                  <div className="mt-5 ">
                    <div className="flex items-center justify-between">
                      <p className={`mt-1 font-mono text-sm`}>
                        Severity : {notif.additional.severity}
                      </p>
                      <p className="mt-1 font-black font-mono text-right text-sm text-error">
                        Error Code : <span className=''>{notif.additional.error_code}</span>
                      </p>
                    </div>
                    <div className="mt-2 mockup-code ">
                      <pre>
                        <code className="">{notif.additional.error_log}</code>
                      </pre>
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  {notif.links.map((link, id) =>
                    link.link.length > 0 ? (
                      <a
                        className="link mt-2 truncate flex items-center"
                        target="blank"
                        href={getLink(
                          link.link,
                          link.link_short,
                          link.link_mode
                        )}
                      >
                        <span>
                          <HiLink className="text-xl mr-2" />
                        </span>
                        {getLink(link.link, link.link_short, link.link_mode)}
                      </a>
                    ) : (
                      <>
                        <p>No link</p>
                      </>
                    )
                  )}
                </div>
                <p className="mt-3 font-medium text-xs text-right opacity-80">
                  {dateToWord(notif.date)}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center">
        <p
          className="text-center underline cursor-pointer"
          onClick={() => deleteAll()}
        >
          Clear All
        </p>
      </div>
    </div>
  );
};

export default NotificationContent;
