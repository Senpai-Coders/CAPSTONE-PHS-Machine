import { COMPARE_PASSWORD } from "../../../helpers/api";
import dbConnect from "../../../configs/dbConnection";

const users = require("../../../models/user");
const configs = require("../../../models/configs");
const detection = require("../../../models/thermal_detection");
const notification = require("../../../models/notification");

let ObjectId = require("mongoose").Types.ObjectId;

dbConnect();

const handler = async (req, res) => {
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
      config_name: "Cell 1",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 1,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 2",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 2,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 3",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 3,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 4",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 4,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 5",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 5,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 6",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 6,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 7",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 7,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Cell 8",
      description: "This will be utilized by the AI",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Heat Stress Detector",
        forceActivate: false, // Regardless event location it will activate on caller
        eventLocation: 8,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Piggery Lights",
      description: "This will be utilized by the Dark Scene Detector",
      value: {
        targets: [{ target_relay: "18", duration: 50 }],
        caller: "Dark Scene Detector",
        forceActivate: true, // Regardless event location it will activate on caller
        eventLocation: 1,
      },
      deletable: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    // RELAYS
    {
      category: "relays",
      config_name: "21",
      description: " - ",
      value: { GPIO_PIN: 21 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "20",
      description: " - ",
      value: { GPIO_PIN: 20 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "26",
      description: " - ",
      value: { GPIO_PIN: 26 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "16",
      description: " - ",
      value: { GPIO_PIN: 16 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "19",
      description: " - ",
      value: { GPIO_PIN: 19 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "13",
      description: " - ",
      value: { GPIO_PIN: 13 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "12",
      description: " - ",
      value: { GPIO_PIN: 12 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "6",
      description: " - ",
      value: { GPIO_PIN: 6 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "5",
      description: " - ",
      value: { GPIO_PIN: 5 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "1",
      description: " - ",
      value: { GPIO_PIN: 1 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "0",
      description: " - ",
      value: { GPIO_PIN: 0 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "7",
      description: " - ",
      value: { GPIO_PIN: 7 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "8",
      description: " - ",
      value: { GPIO_PIN: 8 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "11",
      description: " - ",
      value: { GPIO_PIN: 11 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "25",
      description: " - ",
      value: { GPIO_PIN: 25 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "9",
      description: " - ",
      value: { GPIO_PIN: 9 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "10",
      description: " - ",
      value: { GPIO_PIN: 10 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "24",
      description: " - ",
      value: { GPIO_PIN: 24 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "23",
      description: " - ",
      value: { GPIO_PIN: 23 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "22",
      description: " - ",
      value: { GPIO_PIN: 22 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "27",
      description: " - ",
      value: { GPIO_PIN: 27 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "18",
      description: " - ",
      value: { GPIO_PIN: 18 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "17",
      description: " - ",
      value: { GPIO_PIN: 17 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "15",
      description: " - ",
      value: { GPIO_PIN: 15 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "14",
      description: " - ",
      value: { GPIO_PIN: 14 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "relays",
      config_name: "4",
      description: " - ",
      value: { GPIO_PIN: 4 },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    // CONFIG
    {
      category: "update",
      config_name: "update_stamp",
      description: "This will update phs system infos forced",
      value: "1659839703437",
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: true,
    },
    {
      category: "config",
      config_name: "DetectionMode",
      description: "Specify How PHS will identify heat stress",
      value: {
        mode: false,
        temperatureThreshold: "38.6",
      },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: true,
    },
    {
      category: "config",
      config_name: "storageAutoDelete",
      description: "Specify if PHS will auto delete old records",
      value: false,
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "config",
      config_name: "divisions",
      description:
        "Specifies how many parts the visible area of piggery can be divided",
      value: {
        col: 4,
        row: 2,
      },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
    {
      category: "config",
      config_name: "identity",
      description: "Unique Identity Of phs",
      value: { server_name: "PHS A1", type: "Standalone" },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
      deletable: false,
    },
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

  const DEFAULT_NOTIFICATIONS = [
    {
      notification_type: "notify",
      title: "Welcome To PHS",
      message:
        "Welcome to phs, you can read the full manual bellow to get started.",
      priority: 0,
      links: [
        {
          link : "http://localhost:3001/",
          link_short: "/",
          link_mode: false,
        },
        {
            link : "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1",
            link_short: "/",
            link_mode: false
        }
      ],
      seenBy: [],
      date: new Date(),
    },
  ];

  try {
    const { default_users, settings, detections, notifications } = req.body;

    if (default_users) {
      console.log("init us");
      const del = await users.deleteMany({});
      const resp = await users.insertMany(DEFAULT_USERs);
    }

    if (settings) {
      console.log("init conf");
      const del2 = await configs.deleteMany({});
      const resp2 = await configs.insertMany(DEFAULT_CONFIGS);
    }
    if (detections) {
      console.log("init det");
      const del3 = await detection.deleteMany({});
      const resp3 = await detection.insertMany(DEFAULT_DETECTS);
    }

    if (notifications) {
      console.log("init notifications");
      const del4 = await notification.deleteMany({});
      const resp4 = await notification.insertMany(DEFAULT_NOTIFICATIONS);
    }
  } catch (e) {
    console.log(e);
  }
  res.status(200).json({ status: "Initialized Db 👌" });
};

export default handler;
