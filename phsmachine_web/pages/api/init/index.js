import { COMPARE_PASSWORD } from "../../../helpers/api";
import dbConnect from "../../../configs/dbConnection";

const users = require("../../../models/user");
const configs = require("../../../models/configs");
const detections = require("../../../models/thermal_detection");

let ObjectId = require("mongoose").Types.ObjectId;

dbConnect();

const handler = async (req, res) => {
  console.log("Called");
  const DEFAULT_USERs = [
    {
      user_name: "PHS_SYSTEM_V1",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 3, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
    {
      user_name: "Employee 1",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 1, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
    {
      user_name: "Admin 1",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 2, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
    {
      user_name: "Employee 2",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 1, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
    {
      user_name: "Viewer 1",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 0, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
    {
      user_name: "Admin 2",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 2, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
  ];

  const DEFAULT_CONFIGS = [
    //Actions
    {
      category: "actions",
      config_name: "Mist Div 1",
      description: "This will be utilized by the AI",
      value: {
        targets : [{ target_relay : "18", duration : 1 }],
        caller: "Pig Detector",
        forceActivate : true, // Regardless event location it will activate on caller
        eventLocation : 1
      },
      deletable : false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    // RELAYS
    {
      category: "relays",
      config_name: "18",
      description: " - ",
      value: { GPIO_PIN: 18 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable : false
    },
    {
      category: "relays",
      config_name: "Led Light",
      description: "Lights is connected on Relay 2",
      value: { GPIO_PIN: 14, isUsed: true },
      disabled: false,
      deletable : false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    }, 
    // CONFIG
    {
      category: "update",
      config_name: "update_stamp",
      description: "This will update phs system infos forced",
      value: "1659839703437",
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable : true
    },
    {
      category: "config",
      config_name: "DetectionMode",
      description: "Specify How PHS will identify heat stress",
      value: {
        mode: true,
        temperatureThreshold: "47.2",
      },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable : true
    },
    {
        category: "config",
        config_name: "storageAutoDelete",
        description: "Specify if PHS will auto delete old records",
        value: false,
        disabled: false,
        uby: new ObjectId("6277e36f94637471bdabb80d"),
        deletable : false
    },
    {
        category: "config",
        config_name: "divisions",
        description: "Specifies how many parts the visible area of piggery can be divided",
        value: {
            col : 4,
            row : 2
        },
        disabled: false,
        uby: new ObjectId("6277e36f94637471bdabb80d"),
        deletable : false
      }
  ];

  const DEFAULT_DETECTS = [
    {
      img_normal: "/detection/Detection-2022_06_07-04:25:25_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:25:25_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:25:25_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:25_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:25_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:25_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:14_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:14_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:14_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:14_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:14_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:14_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:21_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:21_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:21_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:21_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:21_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:21_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:35_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:35_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:35_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:35_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:35_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:35_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:35_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:35_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:35_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:41_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:41_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:41_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:41_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:41_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:41_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:41_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:41_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:41_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:19:29_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:19:29_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:19:29_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:19:29_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:19:29_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:19:29_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:10_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:10_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:10_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:10_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:10_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:10_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:10_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:10_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:10_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:17_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:17_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:17_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:17_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:17_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:17_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:24_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:24_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:24_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:24_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:24_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:24_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:24_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:24_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:24_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:31_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:31_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:31_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:31_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:31_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:31_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:37_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:37_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:37_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:37_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:37_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:37_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:37_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:37_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:37_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:44_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:44_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:44_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:44_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:44_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:44_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:44_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:44_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:44_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:20:57_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:20:57_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:20:57_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:20:57_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:20:57_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:20:57_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:21:10_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:21:10_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:21:10_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:10_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:10_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:10_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:10_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:10_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:10_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:21:35_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:21:35_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:21:35_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:35_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:35_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:35_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:21:41_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:21:41_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:21:41_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:41_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:41_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:41_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:21:49_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:21:49_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:21:49_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:49_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:49_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:49_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:21:56_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:21:56_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:21:56_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:21:56_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:22:03_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:22:03_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:22:03_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:03_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:22:10_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:22:10_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:22:10_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:10_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:10_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:10_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:22:30_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:22:30_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:22:30_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:30_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:30_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:30_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:22:36_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:22:36_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:22:36_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:36_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:36_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:36_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:36_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:36_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:36_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:22:44_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:22:44_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:22:44_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:44_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:44_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:44_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:22:54_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:22:54_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:22:54_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:22:54_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:23:03_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:23:03_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:23:03_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:23:03_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:23:03_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:23:03_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:23:03_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:23:03_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:23:03_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:23:29_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:23:29_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:23:29_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:23:29_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:23:29_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:23:29_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:23:35_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:23:35_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:23:35_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:23:35_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:23:35_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:23:35_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:24:14_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:24:14_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:24:14_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:14_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:24:33_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:24:33_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:24:33_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:33_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:33_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:33_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:24:40_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:24:40_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:24:40_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:40_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:40_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:40_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:40_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:40_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:40_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:24:47_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:24:47_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:24:47_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:47_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:47_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:47_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:47_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:47_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:47_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:24:54_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:24:54_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:24:54_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:24:54_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:24:54_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:24:54_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:25:01_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:25:01_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:25:01_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:01_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:25:14_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:25:14_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:25:14_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:14_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:14_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:14_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:25:21_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:25:21_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:25:21_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:21_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:21_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:21_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:25:31_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:25:31_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:25:31_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:31_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:25:50_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:25:50_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:25:50_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:50_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:50_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:50_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:25:50_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:25:50_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:25:50_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:03_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:03_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:03_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:03_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:03_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:03_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:10_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:10_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:10_AM/img_thermal.png",
      data: {
        pig_count: 5,
        stressed_pig: 5,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-unprocessed4.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-5.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-processed5.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:10_AM/Target/pig-thermal-unprocessed5.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:15_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:15_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:15_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:15_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:15_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:15_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:22_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:22_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:22_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:22_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:22_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:22_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:29_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:29_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:29_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:29_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:29_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:29_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:29_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:29_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:29_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:36_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:36_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:36_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:36_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:36_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:36_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:36_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:36_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:36_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:43_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:43_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:43_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:43_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:43_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:43_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:49_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:49_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:49_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:49_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:49_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:49_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:26:56_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:26:56_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:26:56_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:26:56_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:27:02_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:27:02_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:27:02_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:02_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:02_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:02_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:27:28_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:27:28_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:27:28_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:28_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:28_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:28_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:27:35_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:27:35_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:27:35_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:35_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:35_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:35_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:35_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:35_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:35_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:27:49_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:27:49_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:27:49_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:49_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:27:55_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:27:55_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:27:55_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:55_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:55_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:55_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:27:55_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:27:55_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:27:55_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:02_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:02_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:02_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:02_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:09_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:09_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:09_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:09_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:09_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:09_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:09_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:09_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:09_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:22_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:22_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:22_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:22_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:29_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:29_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:29_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:29_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:42_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:42_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:42_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:42_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:50_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:50_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:50_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:50_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:50_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:50_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:28:57_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:28:57_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:28:57_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:57_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:57_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:57_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:28:57_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:28:57_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:28:57_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:03_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:03_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:03_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:03_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:03_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:03_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:10_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:10_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:10_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:10_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:10_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:10_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:17_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:17_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:17_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:17_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:17_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:17_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:30_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:30_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:30_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:30_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:30_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:30_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:37_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:37_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:37_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:37_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:43_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:43_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:43_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:43_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:29:49_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:29:49_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:29:49_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:29:49_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:02_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:02_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:02_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:02_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:02_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:02_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:08_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:08_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:08_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:08_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:08_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:08_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:08_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:08_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:08_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:22_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:22_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:22_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:22_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:22_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:22_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:22_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:22_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:22_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:29_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:29_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:29_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:29_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:36_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:36_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:36_AM/img_thermal.png",
      data: {
        pig_count: 5,
        stressed_pig: 5,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-unprocessed4.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-5.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-processed5.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:36_AM/Target/pig-thermal-unprocessed5.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:43_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:43_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:43_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:43_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:49_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:49_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:49_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:49_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:49_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:49_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:49_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:49_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:49_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:30:55_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:30:55_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:30:55_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:30:55_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:02_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:02_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:02_AM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 4,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-unprocessed3.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-4.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-processed4.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:02_AM/Target/pig-thermal-unprocessed4.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:08_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:08_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:08_AM/img_thermal.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:08_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:08_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:08_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:08_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:08_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:08_AM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:22_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:22_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:22_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:22_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:22_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:22_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:28_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:28_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:28_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:28_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:28_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:28_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:35_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:35_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:35_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:35_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:35_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:35_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:43_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:43_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:43_AM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-3.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-thermal-processed3.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:43_AM/Target/pig-thermal-unprocessed3.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
    {
      img_normal: "/detection/Detection-2022_06_07-04:31:49_AM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_07-04:31:49_AM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_07-04:31:49_AM/img_thermal.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_07-04:31:49_AM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_07-04:31:49_AM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_07-04:31:49_AM/Target/pig-thermal-unprocessed1.png",
          },
        ],
      },
      actions: [
        { action: "Mist", duration: 10 },
        { action: "Fan", duration: 20 },
      ],
    },
  ];

  console.log("Defined Defaults");

  try {
    const { us, conf, det } = req.body;

    if (us) {
      console.log("init us");
      const del = await users.deleteMany({});
      const resp = await users.insertMany(DEFAULT_USERs);
      console.log(del, resp);
    }

    if (conf) {
      console.log("init conf");
      const del2 = await configs.deleteMany({});
      const resp2 = await configs.insertMany(DEFAULT_CONFIGS);
    }
    if (det) {
      console.log("init det");

      const del3 = await detections.deleteMany({});
      const resp3 = await detections.insertMany(DEFAULT_DETECTS);
    }
  } catch (e) {
    console.log(e);
  }
  res.status(200).json({ status: "Initialized Db 👌" });
};

export default handler;
