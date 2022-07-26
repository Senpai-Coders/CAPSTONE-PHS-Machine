import Calendar from "react-calendar";
import { dateMMDDYYYY, dateYYYYMMDD } from "../../helpers";

const SinglePick = ({
  dateChanged,
  onApply,
  textDescription,
  setDate,
  defaultDate,
}) => {
  const feature1 = false;

  return (
    <div className="dropdown dropdown-left md:dropdown-right">
      <label tabindex="0" className="btn btn-sm btn-ghost btn-outline m-1">
        {dateMMDDYYYY(defaultDate, "/")}
      </label>
      <div
        tabIndex="0"
        className="dropdown-content w-64 bg-base-100/90 backdrop-blur-sm card card-compact p-1 shadow "
      >
        <div className="card-body">
          <h2 className="card-title text-lg">{textDescription}</h2>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Select Start Date</span>
            </label>
            <input
              value={dateYYYYMMDD(defaultDate, "-")}
              type="date"
              onChange={(e) => {
                setDate(new Date(e.target.value));
              }}
              placeholder="Type here"
              class="input input-bordered"
            />
          </div>

          {feature1 && <Calendar onChange={setDate} value={defaultDate} />}
          {dateChanged && (
            <div className="card-actions justify-end">
              <button onClick={() => onApply()} class="btn btn-sm">
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
