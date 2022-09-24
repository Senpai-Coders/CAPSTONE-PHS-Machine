import { appendToFSUrl } from "../../helpers";

const ActiveUserBlock = ({ users }) => {
  const max = 4;

  if (!users) users = [];

  return (
    <div className="mb-4 mx-0 sm:ml-4 xl:mr-4">
      <div className="shadow-lg rounded-2xl card bg-base-100 w-full">
        <div className="p-4 flex items-center justify-start">
          <p className="ml-2 font-bold text-md">Active Users</p>
        </div>
        <div className="form-control mx-4 mb-4">
          <div className="avatar-group -space-x-6">
            {users.map((usr, idx) =>
              idx < max ? (
                <div key={idx} className="avatar bg-base-300 shadow-xl">
                  <div className="w-12">
                    <img src={appendToFSUrl(usr.photo)} />
                  </div>
                </div>
              ) : (
                <></>
              )
            )}
            {users.length > max && (
              <div className="avatar placeholder">
                <div className="w-12 bg-neutral-focus text-neutral-content">
                  <span>+{users.length - max}</span>
                </div>
              </div>
            )}
            {users.length === 0 && (
              <p className="opacity-40 text-center my-2 text-sm">
                No Active Users
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUserBlock;
