import { useState } from "react";
import { useRouter } from "next/router";
import { API } from "../../helpers";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { GoInfo } from "react-icons/go";

const signin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("PHS_SYSTEM_V1");
  const [password, setPassword] = useState("johny123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const signin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await API.post("/api/authentication/signin", {
        username,
        password,
      });
      router.push("/");
    } catch (e) {
      console.log(e);
      setLoading(false);
      if (e.response) {
        //request was made but theres a response status code
        console.log(e.response.data);
        if (e.response.data.error === 403) setErr("password");
        if (e.response.data.error === 404) setErr("username");
      } else if (e.request) {
        // The request was made but no response was received
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-screen">
      <div className="flex items-center bg-[#FDE9F4]">
        <div className="m-auto my-10 w-9/12 text-[#663A52]">
          <p className="font-inter text-xl opacity-80 font-light tracking-wide mb-8">
            PHS
          </p>
          <p className="font-inter text-2xl font-semibold tracking-wider mb-8 mr-8">
            Helping piggery owners in resolving & preventing pig heat stress
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => signin(e)}
        className="flex font-inter items-center"
      >
        <div className="m-auto py-8 md:py-0 w-9/12 md:w-7/12">
          <p className=" text-2xl font-semibold tracking-wide mb-8">
            Signin To PHS
          </p>
          <div className="mb-6">
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
          <div className="mb-6">
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
            } btn btn-primary btn-md btn-block md:btn-wide `}
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
    </div>
  );
};

export default signin;
