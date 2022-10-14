import Layout from "../components/layout";
import Head from "next/head";
import { useEffect, useState } from "react";

import UserCard from "../components/userCard";

import axios from "axios";
import { BsFillKeyFill } from "react-icons/bs";

import { TiInfoLarge, TiUserAdd } from "react-icons/ti";
import { toast } from "react-toastify";

const Accounts = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState();

  const [deleteModal, setDeleteModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const init = async () => {
    try {
      const resp = await axios.post("/api/phs/accounts", {});
      const myData = await axios.post("/api/phs/userDetails");
      setUsers(resp.data.users);
      setUserData(myData.data.userData);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteUser = async () => {
    const id = toast.loading("Deleting user...", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    try {
      const response = await axios.post("/api/phs/updateUser", {
        mode: -1,
        _id: targetId,
      });
      setDeleteModal(false);
      setTargetId(null);
      init();
      toast.update(id, {
        render: "Deleted successfuly!",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } catch (e) {
      toast.update(id, {
        render: "Error saving changes",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  const newUser = async () => {
    const id = toast.loading("Generating User...", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    try {
      const resp = await axios.post("/api/phs/updateUser", { mode: 0 });
      init();
      toast.update(id, {
        render: "User Created!",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } catch (e) {
      toast.update(id, {
        render: "Error creating user",
        type: "error",
        isLoading: false,
        autoClose: true,
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Head>
        <title>Accounts</title>
      </Head>

      <div
        className={`modal modal-bottom sm:modal-middle ${
          deleteModal ? "modal-open" : ""
        }`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete User?</h3>
          <p className="py-4">
            Are you sure to delete this user? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button
              onClick={() => {
                deleteUser();
              }}
              className="btn"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setTargetId(null);
                setDeleteModal(false);
              }}
              className="btn glass"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-xl card-title font-lato font-semibold">
          Account Management
        </p>

        {loading && (
          <div className="mx-10 w-1/12 flex items-center space-x-4">
            <progress className="progress"></progress>
          </div>
        )}
      </div>
      <div className="mt-8 relative">
        <div className=" text-sm flex space-x-3 bg-none items-center mt-6">
          <BsFillKeyFill className={`text-accent w-5 h-5    `} />
          <span>Manage who can access the system</span>
        </div>
        <div className=" text-sm flex space-x-3 bg-none items-center mt-2">
          <TiInfoLarge className={`text-blue-600 w-5 h-5    `} />
          <span>You can't edit users that have higher role than you</span>
        </div>
        <button
          onClick={() => {
            if (loading) return;
            newUser();
          }}
          className={`btn mb-2 mt-6 ${
            !loading && userData.role < 1 ? "btn-disabled" : ""
          }`}
        >
          <TiUserAdd className="mr-2 h-5 w-5" />
          New User
        </button>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u, i) => (
            <UserCard
              onDelete={(toDelete) => {
                setTargetId(toDelete);
                setDeleteModal(true);
              }}
              onUpdate={init}
              key={i}
              u={u}
              editor_info={userData}
            />
          ))}
        </div>
      </div>
    </>
  );
};

Accounts.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Accounts;
