import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { GoInfo } from "react-icons/go";
import { MdOutlineClose } from "react-icons/md";

import PhsScanner from "../../components/Phs_Scanner/PhsScanner";

import axios from "axios";

const signin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const [showScan, setShowScan] = useState(false);
  const [curIp, setCurIp] = useState("-");

  const signin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await axios.post("/api/authentication/signin", {
        username,
        password,
      });
      router.push("/");
    } catch (e) {
      console.log(e);
      setLoading(false);
      if (e.response) {
        if (e.response.data.error === 403) setErr("password");
        if (e.response.data.error === 404) setErr("username");
      } else if (e.request) {
      } else {
        console.log("Error", e.message);
      }
    }
  };

  const init = async () => {
    try {
      const data = await axios.get("/api/connectivity");
      setCurIp(data.data.ip);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-screen relative">
        <Head><title>Sign In</title></Head>
      <div className="flex items-center bg-[#FDE9F4]">
        <div className="m-auto my-10 w-9/12 text-[#663A52]">
          <div className="flex justify-start items-center">
            <img src="/pig.png" className="mr-2"/>
            <p className="font-inter text-xl opacity-80 font-light tracking-wide">
              PHS
            </p>
          </div>
          <p className="mt-8 font-inter text-2xl font-semibold tracking-wider mr-8">
            Helping piggery owners in resolving & preventing pig heat stress
          </p>
          <p className="mt-9">
            You can switch to other phs devices on your local network
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowScan(true);
            }}
            className="mt-4 btn btn-sm "
          >
            Switch PHS
          </button>
        </div>
      </div>
      <form
        onSubmit={(e) => signin(e)}
        className="flex font-inter items-center"
      >
        <div className="m-auto py-8 md:py-0 w-9/12 md:w-7/12">
          <div className="flex justify-start items-center">
            <p className="text-2xl font-semibold tracking-wide">
              Signin To PHS
            </p>
          </div>
          <div className="mt-8">
            <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              placeholder=""
              value={username}
              onChange={(e) => {
                setErr("");
                setUsername(e.target.value);
              }}
              className={`tracking-wider input input-bordered w-full input-md ${
                err === "username" ? "input-error" : ""
              }`}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              Password
            </label>

            <div className="form-control">
              <label className="input-group">
                <input
                  type={!show ? "password" : "text"}
                  placeholder=""
                  value={password}
                  onChange={(e) => {
                    setErr("");
                    setPassword(e.target.value);
                  }}
                  required
                  className={`tracking-wider input input-bordered w-full input-md ${
                    err === "password" ? "input-error" : ""
                  }`}
                />

                <span
                  className="cursor-pointer "
                  onClick={() => setShow(!show)}
                >
                  <div
                    className="tooltip tracking-wide"
                    data-tip="show/hide password"
                  >
                    {!show ? (
                      <AiFillEyeInvisible className="h-6 w-6" />
                    ) : (
                      <AiFillEye className="h-6 w-6" />
                    )}
                  </div>
                </span>
              </label>
            </div>
          </div>

          {loading && (
            <div className="my-8 ">
              <p className="">Verifying...</p>
              <progress className="progress progress-primary"></progress>
            </div>
          )}

          {err !== "" && (
            <p className="text-error mb-4 ">
              {err === "username" ? "User not found" : "Wrong password"}
            </p>
          )}

          <button
            onClick={(e) => signin(e)}
            className={`${
              username.length === 0 || password.length === 0 || loading
                ? "btn-disabled"
                : ""
            } btn btn-primary btn-md mt-4 btn-block md:btn-wide `}
          >
            Sign In
          </button>

          <div className="alert text-sm mt-4 shadow-lg">
            <div>
              <GoInfo className="h-5 w-5" />
              <span>If you forgot your password, contact the root admin.</span>
            </div>
          </div>
        </div>
      </form>
      <div
        onClick={(e) => {
          e.preventDefault();
        }}
        className={`duration-500 ease-in-out w-screen min-h-screen bg-base-100/80 backdrop-blur-xl absolute ${
          showScan ? "left-0" : "-left-full"
        }`}
      >
        {" "}
        <div className="flex justify-between items-center p-4">
          <p></p>
          <MdOutlineClose
            onClick={() => setShowScan(false)}
            className="text-2xl"
          />
        </div>
        <PhsScanner
          curIp={curIp}
          mountedOnSignIn={true}
          onSwitch={(v) => {
            window.open(v.url, "_blank");
          }}
        />
      </div>
    </div>
  );
};

export default signin;
