import React, { useEffect, useState } from "react";

import { AiFillEdit } from "react-icons/ai";
import { VscClose } from "react-icons/vsc";

import { AnimatePresence, motion } from "framer-motion";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { TiUserDelete } from "react-icons/ti";

import axios from "axios";
import { getRole, getRoleIcon } from "../helpers";

const userCard = ({ u, editor_info, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  const [pass, setPass] = useState("");
  const [username, setUserName] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState("");

  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const editable = () => {
    if (u._id === editor_info._id) return true;
    if (u.role === 3) return false;
    return editor_info.role >= u.role;
  };

  const changableRole = () => {
    if (editor_info._id === u._id || editor_info.role <= 1) return false;
    return editor_info.role > u.role;
  };

  const updateRole = async (role) => {
    try {
      if (u.role === role) return;
      const update = await axios.post("/api/phs/updateUser", {
        _id: u._id,
        updates: { role },
        mode: 1,
      });
      onUpdate();
    } catch (e) {
      console.log(e);
    }
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
      setHasNewImage(true);
    }
  };

  const uploadToServer = async (event) => {
    try {
      setLoading(true);
      const body = new FormData();
      body.append("file", image);
      body.append("uid", u._id);
      const response = await fetch("/api/phs/uploadPhoto", {
        method: "POST",
        body,
      });
      onUpdate();
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const updateInfo = async () => {
    try {
      let update = {};
      setLoading(true);

      if (hasNewImage) {
        const body = new FormData();
        body.append("file", image);
        body.append("uid", u._id);
        const response = await fetch("/api/phs/uploadPhoto", {
          method: "POST",
          body,
        });
      }

      if (pass.length === 0 && username.length === 0) {
        setLoading(false);
        init();
        onUpdate();
        return;
      }

      if (pass.length === 0) {
        console.log(username);
        update = await axios.post("/api/phs/updateUser", {
          _id: u._id,
          mode: 1,
          old_u_name: u.user_name,
          updates: { user_name: username },
        });
      } else
        update = await axios.post("/api/phs/updateUser", {
          _id: u._id,
          mode: 1,
          old_u_name: u.user_name,
          updates: { user_name: username, password: pass },
          hasNewPassword: true,
        });
      setLoading(false);
      init();
      onUpdate();
    } catch (e) {
      console.log(e);
      setLoading(false);
      if (e.response) {
        //request was made but theres a response status code
        //console.log(e.response.data);
        if (e.response.data.error === 409) setErrMsg(e.response.data.message);
      } else if (e.request) {
        // The request was made but no response was received
      } else {
        // Something happened in setting up the request that triggered an Error
        //console.log("Error", error.message);
      }
    }
  };

  const init = () => {
    setCreateObjectURL(u.photo);
    setUserName(u.user_name);
    setHasNewImage(false);
    setPass("");
  };

  useEffect(() => {
    init();
  }, [u]);

  return (
    <div className="mb-4">
      <div className="shadow-lg rounded-2xl p-4 bg-base-200 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-12 mask mask-squircle">
                <img src={u.photo} />
              </div>
            </div>
            <div className="flex flex-col w-10/12">
              <span className="font-bold text-md ml-2 break-all">
                {u.user_name}
              </span>
              <span className="text-sm ml-2">
                {getRole(u.role)}
                {u.role === editor_info.role && u._id === editor_info._id && (
                  <span className="text-sm text-accent animate-pulse ml-2">
                    (You)
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div
              className="tooltip"
              data-tip={editing ? "Cancel Edit" : "Edit"}
            >
              <button
                className={`btn btn-sm btn-square ${
                  editable() ? "" : "btn-disabled"
                }`}
                onClick={() => {
                  init();
                  setEditing(!editing);
                }}
              >
                {!editing ? (
                  <AiFillEdit className="h-5 w-5" />
                ) : (
                  <VscClose className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="tooltip" data-tip="Change Role">
              <div className="dropdown dropdown-left">
                <label
                  tabIndex="0"
                  className={`btn btn-sm btn-square m-1  ${
                    changableRole() ? "" : "btn-disabled"
                  }`}
                >
                  {getRoleIcon(u.role)}
                </label>
                <ul
                  tabIndex="0"
                  className="dropdown-content font-inter menu p-2 shadow bg-base-100/25 backdrop-blur-md rounded-box w-48"
                >
                  <p className="my-4 mx-2">Change Role</p>
                  {editor_info.role > 2 && (
                    <li onClick={() => updateRole(2)}>
                      <div className="flex w-full items-center justify-start">
                        {getRoleIcon(2)}
                        <a>Admin</a>
                      </div>
                    </li>
                  )}
                  <li onClick={() => updateRole(1)}>
                    <div className="flex w-full items-center justify-start">
                      {getRoleIcon(1)}
                      <a>Employee</a>
                    </div>
                  </li>
                  {/* <li onClick={() => updateRole(0)}>
                    <div className="flex w-full items-center justify-start">
                      {getRoleIcon(0)}
                      <a>Viewer</a>
                    </div>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="tooltip" data-tip="Delete User">
              <label
                htmlFor="modal-user-delete"
                className={`btn btn-sm btn-square  ${
                  changableRole() ? "" : "btn-disabled"
                }`}
                onClick={() => {
                  onDelete(u._id);
                }}
              >
                <TiUserDelete className="h-5 w-5" />
              </label>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className=""
            >
              {loading && (
                <div className="w-full flex items-center my-4">
                  <progress className="progress progress-accent"></progress>
                </div>
              )}
              <div className=" font-inter">
                <div className="flex justify-center mb-4">
                  <div className="h-44 avatar">
                    <div className="mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-1">
                      <img className="" src={createObjectURL} />
                    </div>
                  </div>
                </div>
                {!hasNewImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center mb-4"
                  >
                    <label className="">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        onChange={uploadToClient}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-base-100 file:text-accent hover:file:bg-base-300"
                      />
                    </label>
                  </motion.div>
                )}
              </div>

              <div className="mb-4 font-inter">
                <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => {
                    // setErr("");
                    setErrMsg("");
                    setUserName(e.target.value);
                  }}
                  className={`tracking-wider input-sm input input-bordered w-full input-md`}
                  required
                />
              </div>
              <div className="mb-4 font-inter">
                <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                  Password
                </label>
                <div className="form-control">
                  <label className="input-group">
                    <input
                      type={!show ? "password" : "text"}
                      placeholder="New Password"
                      value={pass}
                      onChange={(e) => {
                        //setErr("");
                        setErrMsg("");
                        setPass(e.target.value);
                      }}
                      required
                      className={`tracking-wider input-sm input input-bordered w-full input-md`}
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
              {errMsg.length > 0 && (
                <p className="text-center text-error my-2 text-sm">{errMsg}</p>
              )}
              {(username !== u.user_name || pass.length !== 0 || hasNewImage) &&
                username.length !== 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    exit={{ opacity: 0 }}
                    className="flex mb-4"
                  >
                    <button
                      onClick={() => {
                        updateInfo();
                      }}
                      disabled={
                        username === u.user_name &&
                        pass.length === 0 &&
                        !hasNewImage
                      }
                      className="btn w-1/2 btn-sm"
                    >
                      Save
                    </button>
                    <button
                      disabled={
                        username === u.user_name &&
                        pass.length === 0 &&
                        !hasNewImage
                      }
                      onClick={() => {
                        init();
                        setPass("");
                      }}
                      className="btn w-1/2 btn-sm glass"
                    >
                      Reset
                    </button>
                  </motion.div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="block m-auto">
          <div className="flex mt-5 items-center justify-between">
            <span className="text-sm inline-block ">
              {/* Actions : <span className="text-accent font-bold">25</span> */}
            </span>
            <span className=" items-center text-xs rounded-md">
              Last Login: {new Date(u.sign_in).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default userCard;
