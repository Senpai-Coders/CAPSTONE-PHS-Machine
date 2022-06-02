import { NextResponse } from 'next/server'
import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

export const middleware = async(req) => {
    const auth = req.cookies.authorization
    const { url, origin } = req.nextUrl.clone();

    if (!auth)
        return new Response(JSON.stringify({
            status: 401,
            message: "Sorry, your authorization is missing or expired",
            solution: "Please sign in again"
        }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

    const axiosInstance = axios.create({
        adapter: fetchAdapter,
    });

    const verify_token = await axiosInstance.get(`${origin}/api/authentication/verify_authorization?auth=${auth}`)

    if (!verify_token.data.value)
        return new Response(JSON.stringify({
            status: 401,
            message: "Sorry, your authorization is invalid, or have been tampered",
            solution: "Please sign in again"
        }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

    return NextResponse.next()
}