import Calendar from "react-calendar";
import { dateMMDDYYYY, dateYYYYMMDD } from "../../helpers";

const SinglePick = ({
  dateChanged,
  onApply,
  textDescription,
  setDate,
  defaultDate,
  hideApply,
}) => {
  const feature1 = false;

  return (
    <div className="dropdown dropdown-left md:dropdown-right">
      <label tabindex="0" className="btn btn-sm btn-ghost btn-outline m-1">
        {dateMMDDYYYY(defaultDate, "/")}
      </label>
      <div
        tabIndex="0"
        className="dropdown-content w-64 bg-base-100/90 backdrop-blur-sm card card-compact p-1 shadow-xl "
      >
        <div className="card-body">
          <h2 className="card-title text-lg">{textDescription}</h2>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Date</span>
            </label>
            <input
              value={dateYYYYMMDD(defaultDate, "-")}
              type="date"
              onChange={(e) => {
                setDate(new Date(e.target.value));
              }}
              placeholder="Type here"
              className="input input-bordered"
            />
          </div>

          {feature1 && <Calendar onChange={setDate} value={defaultDate} />}
          {!hideApply && dateChanged && (
            <div className="card-actions justify-end">
              <button onClick={() => onApply()} className="btn btn-sm">
                apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePick;
