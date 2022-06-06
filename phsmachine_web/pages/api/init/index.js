import { COMPARE_PASSWORD } from "../../../helpers/api";
import dbConnect from "../../../configs/dbConnection";

const users = require("../../../models/user");
const configs = require("../../../models/configs");
const detections = require("../../../models/thermal_detection");

let ObjectId = require("mongoose").Types.ObjectId;

dbConnect();

const handler = async (req, res) => {
  console.log("Called")
  const DEFAULT_USERs = [
    {
      user_name: "PHS_SYSTEM_V1",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 3, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
    {
      user_name: "Emp1",
      password: "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
      role: 1, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    },
  ];

  const DEFAULT_CONFIGS = [
    //Actions
    {
      category: "actions",
      config_name: "Mist",
      description: "This will be utilized by the AI",
      value: {
        duration: 1, // Duration this device will be on in Seconds
        target_relay: "Relay_1", // relay_1 to relay_3
        caller: "Pig Detector",
      },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Fan",
      description: "This will be utilized by the AI",
      value: {
        duration: 1,
        target_relay: "Relay_2",
        caller: "Heat Stress Detector",
      },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "actions",
      config_name: "Lights",
      description: "This will be utilized by the AI",
      value: {
        duration: 1,
        target_relay: "Relay_3",
        caller: "Dark Scene Detector",
      },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    // RELAYS
    {
      category: "relays",
      config_name: "Relay_1",
      description: "Relay 1 On 4 Channel Relay",
      value: { GPIO_PIN: 4, isUsed: true },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "relays",
      config_name: "Relay_2",
      description: "Relay 2 On 4 Channel Relay",
      value: { GPIO_PIN: 14, isUsed: true },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "relays",
      config_name: "Relay_3",
      description: "Relay 3 On 4 Channel Relay",
      value: { GPIO_PIN: 15, isUsed: true },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
    {
      category: "relays",
      config_name: "Relay_4",
      description: "Relay 4 On 4 Channel Relay",
      value: { GPIO_PIN: 18, isUsed: false },
      disabled: false,
      uby: new ObjectId("6277e36f94637471bdabb80d"),
    },
  ];

  const DEFAULT_DETECTS = [
    {
      img_normal: "/detection/Detection-2022_06_06-12:14:38_PM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_06-12:14:38_PM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_06-12:14:38_PM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:38_PM/Target/pig-thermal-unprocessed2.png",
          },
        ],
      },
      actions: [
        {
          action: "Mist",
          duration: 10,
        },
        {
          action: "Fan",
          duration: 20,
        },
      ],
      date: "6/6/2022",
    },
    {
      img_normal: "/detection/Detection-2022_06_06-12:14:42_PM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_06-12:14:42_PM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_06-12:14:42_PM/img_thermal.png",
      data: {
        pig_count: 3,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:42_PM/Target/pig-thermal-unprocessed2.png",
          },
        ],
        
      },actions: [
        {
          action: "Mist",
          duration: 10,
        },
        {
          action: "Fan",
          duration: 20,
        },
      ],
      date: "6/6/2022",
    },
    {
      img_normal: "/detection/Detection-2022_06_06-12:14:45_PM/img_normal.png",
      img_annotated:
        "/detection/Detection-2022_06_06-12:14:45_PM/img_annotated.png",
      img_thermal:
        "/detection/Detection-2022_06_06-12:14:45_PM/img_thermal.png",
      data: {
        pig_count: 4,
        stressed_pig: 3,
        breakdown: [
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-thermal-processed1.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-thermal-unprocessed1.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-2.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-thermal-unprocessed2.png",
          },
          {
            normal_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-1.png",
            thermal_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-thermal-processed2.png",
            thermal_raw_thumb:
              "/detection/Detection-2022_06_06-12:14:45_PM/Target/pig-thermal-unprocessed2.png",
          },
        ]
      },actions: [
        {
          action: "Mist",
          duration: 10,
        },
        {
          action: "Fan",
          duration: 20,
        },
      ],
      date: "6/6/2022",
    },
  ];

  console.log("Defined Defaults")

  try {
    const del = await users.deleteMany({});
    const del2 = await configs.deleteMany({});
    const del3 = await detections.deleteMany({})

    const resp = await users.insertMany(DEFAULT_USERs);
    console.log("1")
    const resp2 = await configs.insertMany(DEFAULT_CONFIGS);
    console.log("2")
    const resp3 = await detections.insertMany(DEFAULT_DETECTS);
    console.log("3")
  } catch (e) {
    console.log(e);
  }
  res.status(200).json({
    status: "Initialized Db 👌",
  });
};

export default handler;
