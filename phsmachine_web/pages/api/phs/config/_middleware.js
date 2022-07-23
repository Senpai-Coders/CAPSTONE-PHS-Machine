import { NextResponse } from "next/server";
import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

export const middleware = async (req) => {
  const { url, origin } = req.nextUrl.clone();
  const auth = req.cookies.authorization;

  const axiosInstance = axios.create({
    adapter: fetchAdapter,
  });

  const verify_token = await axiosInstance.get(
    `${origin}/api/authentication/verify_authorization?auth=${auth}`
  );
  const myRole = verify_token.data.data.role;

  if (myRole < 1)
    return new Response(
      JSON.stringify({
        status: 401,
        message: "Sorry, your account is not authorized for doing this action",
        solution: "Only higher role users can do this actions",
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
