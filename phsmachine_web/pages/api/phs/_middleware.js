import { NextResponse } from "next/server";
// import axios from "axios";
// import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import { PI_IP } from "../../../helpers";

export const middleware = async (req) => {
  const auth = req.cookies.authorization;
  //   const { url, origin } = req.nextUrl.clone();

  if (!auth)
    return new Response(
      JSON.stringify({
        status: 401,
        message: "Sorry, your authorization is missing or expired",
        solution: "Please sign in again",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  //   const axiosInstance = axios.create({ adapter: fetchAdapter });
  //   const verify_token = await axiosInstance.get(
  //     `http://${PI_IP}:3000/api/authentication/verify_authorization?auth=${auth}`
  //   );

  let verify_token = await fetch(
    `http://${PI_IP}:3000/api/authentication/verify_authorization?auth=${auth}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  verify_token = await verify_token.json();

  if (!verify_token.value)
    return new Response(
      JSON.stringify({
        status: 401,
        message: "Sorry, your authorization is invalid, or have been tampered",
        solution: "Please sign in again",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  return NextResponse.next();
};
