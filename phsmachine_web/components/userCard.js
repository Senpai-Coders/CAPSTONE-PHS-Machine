import React, { useEffect, useState } from "react";
import { validate } from "email-validator";

import { AiFillEdit } from "react-icons/ai";
import { VscClose } from "react-icons/vsc";

import { AnimatePresence, motion } from "framer-motion";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { TiUserDelete } from "react-icons/ti";

import axios from "axios";
import { getRole, getRoleIcon, appendToFSUrl } from "../helpers";
import { toast } from "react-toastify";

const userCard = ({ u, editor_info, onUpdate, onDelete, onNav }) => {
  const [editing, setEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  const [pass, setPass] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [toNotify, setToNotify] = useState(false);
  const [createObjectURL, setCreateObjectURL] = useState("");

  const [loading, setLoading] = useState(false);
  const editable = () => {
    if (u._id === editor_info._id) return true;
    if (u.role === 3) return false;
    return editor_info.role >= u.role;
  };
  const owned = () => u._id === editor_info._id;

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
    const id = toast.loading("Saving changes...", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
          updates: { user_name: username, email, toNotify },
        });
      } else
        update = await axios.post("/api/phs/updateUser", {
          _id: u._id,
          mode: 1,
          old_u_name: u.user_name,
          updates: { user_name: username, password: pass, email, toNotify },
          hasNewPassword: true,
        });
      setLoading(false);
      init();
      onUpdate();
      setEditing(false);
      toast.update(id, {
        render: "Saved!",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
      if (e.response) {
        if (e.response.data.error === 409) {
          toast.update(id, {
            render: e.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: true,
          });
        }
      } else if (e.request) {
        // The request was made but no response was received
        toast.update(id, {
          render: "No response from server, please reload",
          type: "error",
          isLoading: false,
          autoClose: true,
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        //console.log("Error", error.message);

        toast.update(id, {
          render: "Failed to save changes",
          type: "error",
          isLoading: false,
          autoClose: true,
        });
      }
    }
  };

  const init = () => {
    setCreateObjectURL(u.photo);
    setUserName(u.user_name);
    setEmail(u.email);
    setHasNewImage(false);
    setPass("");
    setToNotify(u.toNotify);
  };

  useEffect(() => {
    init();
  }, [u]);

  return (
    <div className="mb-4">
      <div className="shadow-lg rounded-2xl p-4 bg-base-200 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-12 mask mask-squircle">
                <img src={appendToFSUrl(u.photo)} />
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
            {!onNav && (
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
                  </ul>
                </div>
              </div>
            )}
            {!onNav && (
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
            )}
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
              <div className="mt-4 font-inter">
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
                    setUserName(e.target.value);
                  }}
                  className={`tracking-wider input-sm input input-bordered w-full input-md ${
                    username.length === 0 ? "input-error" : ""
                  }`}
                  required
                />
              </div>
              <div className="mb-4 font-inter">
                <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className={`tracking-wider input-sm input input-bordered w-full input-md ${
                    validate(email) ? "" : "input-error"
                  }`}
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
              <div className="divider" />
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Notification Me Via Email</span>
                  <input
                    type="checkbox"
                    onChange={(e) => setToNotify(e.target.checked)}
                    className="toggle"
                    checked={toNotify}
                  />
                </label>
              </div>
              {toNotify && (
                <p className="text-sm mt-2 text-center">
                  Notify via email only works when internet is present
                </p>
              )}

              {(username !== u.user_name ||
                pass.length !== 0 ||
                email !== u.email ||
                toNotify !== u.toNotify ||
                hasNewImage) &&
                username.length !== 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    exit={{ opacity: 0 }}
                    className="flex mt-4 "
                  >
                    <button
                      onClick={() => {
                        updateInfo();
                      }}
                      disabled={
                        username === u.user_name &&
                        pass.length === 0 &&
                        email.length === 0 &&
                        toNotify === u.toNotify &&
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
                        email === u.email &&
                        toNotify === u.toNotify &&
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
        {!onNav && (
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
        )}
      </div>
    </div>
  );
};

export default userCard;
