import { useState, useEffect } from "react";

import { CgThermostat } from "react-icons/cg";
import { VscBellDot, VscError } from "react-icons/vsc";
import { BsClockHistory } from "react-icons/bs";
import { HiLink } from "react-icons/hi";

import { dateToWord, PI_IP } from "../../helpers/index";

const NotificationContent = ({ userData, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([
    {
      notification_type: "notify",
      title: "Heat Stress Action",
      message: "Heat stress action complete",
      priority: 0,
      link: "http://192.168.1.5:3000/detection_details?_id=62d381c1c1407264c718de27",
      link_short : "/detection_details?_id=62d381c1c1407264c718de27",
      link_mode : true,
      seenBy: ["630eae4bbb909833559a7996"],
      date: new Date(),
    },
    {
      notification_type: "notify",
      title: "New user ",
      message: "A new user has been added.",
      priority: 0,
      link: "",
      seenBy: ["630eae4bbb909833559a7991"],
      date: new Date(),
    },
    {
      notification_type: "detection",
      title: "Heat Stress Detected",
      message: "Heat stress at cell 2",
      priority: 0,
      link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
      seenBy: ["630eae4bbb909833559a7991"],
      date: new Date(),
    },
    {
      notification_type: "error",
      title: "PHS Error",
      message: "PHS core encountered an error, refer error code in manual",
      additional: {
        error_code: 0,
        severity: "low",
        error_log: "Traceback (most recent call last): \n File \"<stdin>\", line 1, in <module> \n NameError: name 'asf' is not defined"
      },
      priority: 0,
      link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
      seenBy: ["630eae4bbb909833559a7991"],
      date: new Date(),
    },
    {
      notification_type: "reminder",
      title: "Periodic Checking/Maintinance",
      message:
        "PHS software & hardware needs to be check to ensure the system functions well.",
      additional: {
        error_code: 0,
        severity: "low"
      },
      priority: 0,
      link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
      seenBy: ["630eae4bbb909833559a7996"],
      date: new Date(),
    },
  ]);

  const markAll = () => {};

  const deleteAll = () => {};

  useEffect(() => {
    let markNotification = [];
    let unreads = 0;

    notifications.forEach((notification, idx) => {
      let toCheck = { ...notification };
      let myIdPresent = false;

      if (userData) {
        toCheck.seenBy.forEach((seenconfirm) => {
          if (userData._id === seenconfirm) myIdPresent = true;
          else unreads += 1;
        });
      }

      markNotification.push({ ...toCheck, isMarkedSeen: myIdPresent });
    });

    setUnreadCount(unreads);
    setNotifications(markNotification);
  }, [userData]);

  const getColorCode = (type) => {
    if (type == "detection") return "text-accent";
    if (type == "error") return "text-error";
    if (type == "reminder") return "text-info";
    if (type == "notify") return "";
    return "";
  };

  const getLink = (originalUrl, shortUrl, mode) => {
    if(mode) return `http://${PI_IP}:3000${shortUrl}`
    return originalUrl
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">Notifications</p>
        <p
          className="text-right underline cursor-pointer"
          onClick={() => markAll()}
        >
          Mark all as read
        </p>
      </div>
      <div className="mt-3 max-h-96 shadow-inner overflow-y-scroll">
        {notifications.length <= 0 ? (
          <p className="my-4 text-center text-sm opacity-70">
            No Notifications Yet
          </p>
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
                    {notif.notification_type == "error" && <VscError />}
                    {notif.notification_type == "notify" && <VscBellDot />}
                    {notif.notification_type == "reminder" && (
                      <BsClockHistory />
                    )}
                  </div>
                  <p className="font-medium ">{notif.title}</p>
                </div>
                <p className="mt-1 text-sm">{notif.message}</p>
                {notif.notification_type == "error" && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <p className={`mt-1 font-mono text-sm`}>
                        Severity : {notif.additional.severity}
                      </p>
                      <p className="mt-1 font-mono text-right text-sm text-error">
                        Error Code : {notif.additional.error_code}
                      </p>
                    </div>
                    <div className="mt-2 mockup-code">
                      <pre>
                        <code className="">{notif.additional.error_log}</code>
                      </pre>
                    </div>
                  </div>
                )}
                {notif.link.length > 0 && (
                  <div className="mt-3 flex items-center">
                    <HiLink className="text-4xl mr-2" />
                    <a
                      className="link truncate"
                      target="blank"
                      href={getLink(notif.link, notif.link_short, notif.link_mode)}
                    >
                      {getLink(notif.link, notif.link_short, notif.link_mode)}
                    </a>
                  </div>
                )}
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
