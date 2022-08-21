import Calendar from "react-calendar";
import { dateMMDDYYYY, dateYYYYMMDD } from "../../helpers";
import { FaLongArrowAltRight } from "react-icons/fa";

const SinglePick = ({
  onApply,
  dateChanged,
  textDescription,
  setDate1,
  setDate2,
  date1,
  date2,
}) => {
  const feature1 = false;

  return (
    <div className="dropdown dropdown-left md:dropdown-right">
      <label tabindex="0" className="btn btn-sm btn-ghost btn-outline m-1">
        {dateMMDDYYYY(date1, "/")} <FaLongArrowAltRight className="mx-2" />{" "}
        {dateMMDDYYYY(date2, "/")}
      </label>
      <div
        tabIndex="0"
        className="dropdown-content w-64 bg-base-100/90 backdrop-blur-sm card card-compact p-1 shadow "
      >
        <div className="card-body">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Start Date</span>
            </label>
            <input
              value={dateYYYYMMDD(date1, "-")}
              type="date"
              onChange={(e) => {
                setDate1(new Date(e.target.value));
              }}
              placeholder=""
              className="input input-bordered"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select End Date</span>
            </label>
            <input
              value={dateYYYYMMDD(date2, "-")}
              type="date"
              onChange={(e) => {
                setDate2(new Date(e.target.value));
              }}
              placeholder=""
              className="input input-bordered"
            />
          </div>
          {feature1 && <Calendar onChange={setDate1} value={date1} />}
          {dateChanged && (
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
